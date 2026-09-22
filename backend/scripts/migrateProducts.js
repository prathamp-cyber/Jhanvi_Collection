import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/mongodb.js';
import productModel from '../models/productModel.js';

const ALLOWED_CATEGORIES = ['Rings', 'Bracelet', 'Necklace', 'Bangles', 'Earrings', 'Maang Tikka', 'Bridal Sets', 'Anklets'];
const ALLOWED_SECTIONS = ['Women', 'Kids'];

const runMigration = async () => {
    try {
        await connectDB();

        // Fetch all raw documents from database to inspect legacy fields (like sizes or subCategory)
        const products = await mongoose.connection.db.collection('products').find({}).toArray();

        let updatedCount = 0;
        let skippedCount = 0;
        const skippedReasons = [];

        for (const doc of products) {
            let needsUpdate = false;
            const updateFields = {};
            const unsetFields = {};

            // Check price / mrp
            if (doc.mrp === undefined || doc.mrp === null) {
                updateFields.mrp = doc.price || 0;
                needsUpdate = true;
            }

            // Check section
            if (!doc.section || !ALLOWED_SECTIONS.includes(doc.section)) {
                updateFields.section = 'Women';
                needsUpdate = true;
            }

            // Check category
            if (!doc.category || !ALLOWED_CATEGORIES.includes(doc.category)) {
                updateFields.category = 'Bridal Sets';
                needsUpdate = true;
            }

            // Check variants / sizes conversion
            if (doc.sizes !== undefined) {
                if (Array.isArray(doc.sizes) && doc.sizes.length > 0) {
                    updateFields.variants = [{ label: 'Size', values: doc.sizes }];
                } else if (!doc.variants) {
                    updateFields.variants = [];
                }
                unsetFields.sizes = "";
                needsUpdate = true;
            } else if (!doc.variants) {
                updateFields.variants = [];
                needsUpdate = true;
            }

            // Unset legacy subCategory field if present
            if (doc.subCategory !== undefined) {
                unsetFields.subCategory = "";
                needsUpdate = true;
            }

            if (needsUpdate) {
                const updateDoc = {};
                if (Object.keys(updateFields).length > 0) {
                    updateDoc.$set = updateFields;
                }
                if (Object.keys(unsetFields).length > 0) {
                    updateDoc.$unset = unsetFields;
                }

                await mongoose.connection.db.collection('products').updateOne(
                    { _id: doc._id },
                    updateDoc
                );
                updatedCount++;
                console.log(`Updated product ID ${doc._id} (${doc.name})`);
            } else {
                skippedCount++;
                skippedReasons.push(`Product ID ${doc._id} (${doc.name}): Already matches new schema`);
            }
        }

        console.log("\n================ MIGRATION SUMMARY ================");
        console.log(`Total Products Scanned: ${products.length}`);
        console.log(`Products Updated:       ${updatedCount}`);
        console.log(`Products Skipped:       ${skippedCount}`);
        if (skippedReasons.length > 0) {
            console.log("Skipped Details:");
            skippedReasons.forEach(reason => console.log(` - ${reason}`));
        }
        console.log("===================================================\n");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    }
};

runMigration();
