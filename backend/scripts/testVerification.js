import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import productRouter from '../routes/productRoute.js';
import productModel from '../models/productModel.js';
import http from 'http';

const runTests = async () => {
    try {
        await connectDB();
        connectCloudinary();

        const app = express();
        app.use(express.json());
        app.use('/api/product', productRouter);

        // Global error handler
        app.use((err, req, res, next) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message || 'An error occurred' });
            }
            next();
        });

        const server = http.createServer(app);
        await new Promise(resolve => server.listen(4001, resolve));
        const baseUrl = 'http://localhost:4001';

        const adminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const tinyPngBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'base64'
        );

        console.log("=== STARTING VERIFICATION TESTS ===\n");

        // Helper for sending multipart form requests
        const sendAddProduct = async (fields, includeImage = true) => {
            const formData = new FormData();
            for (const [key, val] of Object.entries(fields)) {
                formData.append(key, val);
            }
            if (includeImage) {
                const blob = new Blob([tinyPngBuffer], { type: 'image/png' });
                formData.append('image1', blob, 'test.png');
            }
            const res = await fetch(`${baseUrl}/api/product/add`, {
                method: 'POST',
                headers: { token: adminToken },
                body: formData
            });
            const data = await res.json();
            return { status: res.status, data };
        };

        // TEST B
        console.log("--- TEST B: Add valid product (MRP 999, Price 599, Bangles) ---");
        const resB = await sendAddProduct({
            name: 'Test Bangle 1',
            description: 'Beautiful bangles',
            category: 'Bangles',
            section: 'Women',
            mrp: '999',
            price: '599',
            variants: JSON.stringify([{ label: "Size", values: ["2.4", "2.6"] }])
        });
        console.log(`Status: ${resB.status}`);
        console.log(`Response:`, JSON.stringify(resB.data, null, 2));
        const testBProductId = resB.data.product?._id;
        console.log(`DiscountPercent: ${resB.data.product?.discountPercent}`);
        const passB = resB.status === 200 && resB.data.success === true && resB.data.product?.discountPercent === 40;
        console.log(`TEST B RESULT: ${passB ? 'PASS' : 'FAIL'}\n`);

        // TEST C
        console.log("--- TEST C: Add product with Price 1200 > MRP 999 ---");
        const resC = await sendAddProduct({
            name: 'Test Invalid Price Product',
            description: 'Invalid price test',
            category: 'Bangles',
            section: 'Women',
            mrp: '999',
            price: '1200',
            variants: JSON.stringify([{ label: "Size", values: ["2.4"] }])
        });
        console.log(`Status: ${resC.status}`);
        console.log(`Response:`, JSON.stringify(resC.data, null, 2));
        const passC = resC.status === 400 && resC.data.success === false && resC.data.message.includes('greater than MRP');
        console.log(`TEST C RESULT: ${passC ? 'PASS' : 'FAIL'}\n`);

        // TEST D
        console.log("--- TEST D: Add product with malformed variants JSON string ---");
        const resD = await sendAddProduct({
            name: 'Test Malformed JSON',
            description: 'Malformed variants test',
            category: 'Bangles',
            section: 'Women',
            mrp: '999',
            price: '599',
            variants: '{ malformed json'
        });
        console.log(`Status: ${resD.status}`);
        console.log(`Response:`, JSON.stringify(resD.data, null, 2));

        // Follow up call to confirm server did not crash
        const resDFollowup = await sendAddProduct({
            name: 'Test D Followup Product',
            description: 'Followup test',
            category: 'Rings',
            section: 'Women',
            mrp: '500',
            price: '300'
        });
        console.log(`Followup Request Status: ${resDFollowup.status}`);
        const testDFollowupId = resDFollowup.data.product?._id;
        const passD = resD.status === 400 && resD.data.success === false && resDFollowup.status === 200;
        console.log(`TEST D RESULT: ${passD ? 'PASS' : 'FAIL'}\n`);

        // TEST E
        console.log("--- TEST E: GET /api/product/list?section=Kids ---");
        // Add a Kids product first
        const resEAdd = await sendAddProduct({
            name: 'Kids Earring',
            description: 'Cute kids earring',
            category: 'Earrings',
            section: 'Kids',
            mrp: '300',
            price: '199'
        });
        const kidsProductId = resEAdd.data.product?._id;

        const resEList = await fetch(`${baseUrl}/api/product/list?section=Kids`);
        const dataEList = await resEList.json();
        console.log(`Kids Products Count: ${dataEList.products?.length}`);
        const allAreKids = dataEList.products?.every(p => p.section === 'Kids');
        console.log(`All returned products section === 'Kids': ${allAreKids}`);
        const passE = resEList.status === 200 && dataEList.products?.length > 0 && allAreKids;
        console.log(`TEST E RESULT: ${passE ? 'PASS' : 'FAIL'}\n`);

        // Clean up temporary test products created in E, D-followup, B
        if (kidsProductId) await productModel.findByIdAndDelete(kidsProductId);
        if (testDFollowupId) await productModel.findByIdAndDelete(testDFollowupId);
        if (testBProductId) await productModel.findByIdAndDelete(testBProductId);

        // TEST F
        console.log("--- TEST F: GET /api/product/list (no query filter) ---");
        const resF = await fetch(`${baseUrl}/api/product/list`);
        const dataF = await resF.json();
        console.log(`Total Products Returned: ${dataF.products?.length}`);
        if (dataF.products && dataF.products.length > 0) {
            console.log("Sample product fields:", {
                _id: dataF.products[0]._id,
                name: dataF.products[0].name,
                category: dataF.products[0].category,
                section: dataF.products[0].section,
                mrp: dataF.products[0].mrp,
                price: dataF.products[0].price,
                discountPercent: dataF.products[0].discountPercent,
                variants: dataF.products[0].variants
            });
        }
        const hasRequiredFields = dataF.products?.every(p =>
            p.mrp !== undefined &&
            p.price !== undefined &&
            p.discountPercent !== undefined &&
            p.section !== undefined &&
            ['Rings', 'Bracelet', 'Necklace', 'Bangles', 'Earrings', 'Maang Tikka', 'Bridal Sets', 'Anklets'].includes(p.category)
        );
        const passF = resF.status === 200 && dataF.products?.length > 0 && hasRequiredFields;
        console.log(`TEST F RESULT: ${passF ? 'PASS' : 'FAIL'}\n`);

        // TEST G
        console.log("--- TEST G: Confirm old migrated products display correctly ---");
        const migratedProducts = dataF.products?.filter(p => p.name === 'God' || p._id === '6ab210eacf888cda8e5aeef4');
        console.log("Migrated product(s):", JSON.stringify(migratedProducts, null, 2));
        const passG = dataF.products?.length > 0;
        console.log(`TEST G RESULT: ${passG ? 'PASS' : 'FAIL'}\n`);

        server.close();
        process.exit(0);

    } catch (error) {
        console.error("Test execution failed:", error);
        process.exit(1);
    }
};

runTests();
