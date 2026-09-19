import mongoose from 'mongoose'

const connectDB = async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("DB connected");
    })
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    } catch(error) {
        console.error("MongoDB Connection Error:", error.message);
        console.error("👉 Please update MONGODB_URI in backend/.env with your MongoDB Atlas connection string or start local MongoDB server.");
    }
} 
export default connectDB;