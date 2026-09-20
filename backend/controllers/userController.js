import validator from 'validator'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const safeCompare = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User doesn't exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            return res.json({success:true, token})
        }
        else{
            return res.json({success:false, message: "Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Route for user register
const registerUser = async (req,res)=>{
    try{
        console.log(req.body)
        const {name, email, password} = req.body;
        // checking user exists or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success: false, message: "User already exists"})
        }
        // validating email and strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success: false, message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save() 
        const token = createToken(user._id)
        res.json({success: true, token})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Route for admin login
const adminLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
        const adminPass = (process.env.ADMIN_PASSWORD || '').trim();

        const isEmailMatch = safeCompare(email, adminEmail);
        const isPassMatch = safeCompare(password, adminPass);

        if(isEmailMatch && isPassMatch){
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
            return res.json({success: true, token})
        }
        else{
            return res.json({success:false, message:"Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: "Invalid credentials"})
    }
}

export {loginUser, registerUser, adminLogin}