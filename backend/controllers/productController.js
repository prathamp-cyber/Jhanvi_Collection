import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import fs from 'fs';

const ALLOWED_CATEGORIES = ['Rings', 'Bracelet', 'Necklace', 'Bangles', 'Earrings', 'Maang Tikka', 'Bridal Sets', 'Anklets'];
const ALLOWED_SECTIONS = ['Women', 'Kids'];

// function to add product
const addProduct = async (req, res) => {
    const imagesToClean = [];
    try {
        const { name, price, mrp, description, category, section, variants, bestseller, isNavratri } = req.body;

        const image1 = req.files && req.files.image1 && req.files.image1[0];
        const image2 = req.files && req.files.image2 && req.files.image2[0];
        const image3 = req.files && req.files.image3 && req.files.image3[0];
        const image4 = req.files && req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        images.forEach(item => {
            if (item && item.path) {
                imagesToClean.push(item.path);
            }
        });

        if (!name || !description || price === undefined || mrp === undefined || !category) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const numPrice = Number(price);
        const numMrp = Number(mrp);

        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number" });
        }

        if (isNaN(numMrp) || numMrp <= 0) {
            return res.status(400).json({ success: false, message: "MRP must be a positive number" });
        }

        if (numPrice > numMrp) {
            return res.status(400).json({ success: false, message: "Price cannot be greater than MRP" });
        }

        if (!ALLOWED_CATEGORIES.includes(category)) {
            return res.status(400).json({ success: false, message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` });
        }

        const productSection = section || 'Women';
        if (!ALLOWED_SECTIONS.includes(productSection)) {
            return res.status(400).json({ success: false, message: `Section must be one of: ${ALLOWED_SECTIONS.join(', ')}` });
        }

        let parsedVariants = [];
        if (variants !== undefined && variants !== null && variants !== '') {
            if (typeof variants === 'string') {
                try {
                    parsedVariants = JSON.parse(variants);
                } catch (e) {
                    return res.status(400).json({ success: false, message: "Invalid variants JSON format" });
                }
            } else if (Array.isArray(variants)) {
                parsedVariants = variants;
            } else {
                return res.status(400).json({ success: false, message: "Invalid variants format" });
            }
        }

        if (!Array.isArray(parsedVariants)) {
            return res.status(400).json({ success: false, message: "Variants must be an array" });
        }

        for (const v of parsedVariants) {
            if (!v || typeof v !== 'object') {
                return res.status(400).json({ success: false, message: "Each variant must be an object with label and values" });
            }
            if (!v.label || typeof v.label !== 'string' || !v.label.trim()) {
                return res.status(400).json({ success: false, message: "Each variant must have a non-empty label" });
            }
            if (!Array.isArray(v.values) || v.values.length === 0) {
                return res.status(400).json({ success: false, message: "Each variant must have a non-empty values array" });
            }
            for (const val of v.values) {
                if (val === undefined || val === null || String(val).trim() === '') {
                    return res.status(400).json({ success: false, message: "Variant values cannot contain empty strings" });
                }
            }
        }

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        let imageUrls = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            price: numPrice,
            mrp: numMrp,
            category,
            section: productSection,
            bestseller: bestseller === 'true' || bestseller === true,
            isNavratri: isNavratri === 'true' || isNavratri === true,
            variants: parsedVariants,
            image: imageUrls,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added", product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    finally {
        for (const filePath of imagesToClean) {
            fs.unlink(filePath, () => { });
        }
    }
};

// function to list product
const listProduct = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.section) {
            filter.section = req.query.section;
        }
        if (req.query.isNavratri !== undefined) {
            filter.isNavratri = req.query.isNavratri === 'true';
        }

        const products = await productModel.find(filter);
        res.json({ success: true, products });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// function to remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };