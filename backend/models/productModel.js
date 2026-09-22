import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    values: [{
        type: String,
        required: true
    }]
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Rings', 'Bracelet', 'Necklace', 'Bangles', 'Earrings', 'Maang Tikka', 'Bridal Sets', 'Anklets']
    },
    section: {
        type: String,
        required: true,
        enum: ['Women', 'Kids'],
        default: 'Women'
    },
    image: {
        type: Array,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    variants: {
        type: [variantSchema],
        default: []
    },
    isNavratri: {
        type: Boolean,
        default: false
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('discountPercent').get(function () {
    if (this.mrp && this.mrp > 0 && typeof this.price === 'number') {
        return Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
    return 0;
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;