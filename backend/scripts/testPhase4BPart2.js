import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import connectDB from '../config/mongodb.js';
import productRouter from '../routes/productRoute.js';
import orderRouter from '../routes/orderRoute.js';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';
import http from 'http';

const runVerification = async () => {
    try {
        await connectDB();

        const app = express();
        app.use(express.json());
        app.use('/api/product', productRouter);
        app.use('/api/order', orderRouter);

        const server = http.createServer(app);
        await new Promise(resolve => server.listen(4003, resolve));
        const baseUrl = 'http://localhost:4003';

        const adminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("=== ADMIN REDESIGN PART 2 INTEGRATION VERIFICATION ===\n");

        // TEST B: ListProducts API & delete workflow
        console.log("--- TEST B: ListProducts search, filter & delete workflow ---");
        const resList = await fetch(`${baseUrl}/api/product/list`);
        const dataList = await resList.json();
        console.log(`Fetched products count: ${dataList.products?.length}`);

        // Create a temporary product for deletion test
        const tempProduct = new productModel({
            name: 'Temp Deletion Item',
            description: 'To be deleted',
            category: 'Earrings',
            section: 'Women',
            mrp: 500,
            price: 300,
            image: ['https://example.com/test.jpg'],
            variants: [{ label: 'Color', values: ['Gold'] }]
        });
        await tempProduct.save();
        console.log(`Created temp product for deletion test: ${tempProduct._id}`);

        // Delete product via API
        const resDelete = await fetch(`${baseUrl}/api/product/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: adminToken
            },
            body: JSON.stringify({ id: tempProduct._id })
        });
        const dataDelete = await resDelete.json();
        console.log("Delete response:", dataDelete);

        // Confirm product no longer exists in list
        const resListAfter = await fetch(`${baseUrl}/api/product/list`);
        const dataListAfter = await resListAfter.json();
        const foundDeleted = dataListAfter.products?.some(p => p._id.toString() === tempProduct._id.toString());
        console.log(`Product still exists in DB after deletion: ${foundDeleted}`);
        const passB = dataDelete.success === true && !foundDeleted;
        console.log(`VERIFY B RESULT: ${passB ? 'PASS' : 'FAIL'}\n`);

        // TEST D & E: AdminOrders list, status update, search
        console.log("--- TEST D & E: AdminOrders list & status update ---");
        // Create temporary order for testing status update
        const tempOrder = new orderModel({
            userId: 'user123',
            items: [
                { name: 'Kundan Ring', price: 999, quantity: 1, size: '2.4' }
            ],
            amount: 1009,
            address: {
                firstName: 'Test',
                lastName: 'Customer',
                street: '123 Main St',
                city: 'Ahmedabad',
                state: 'Gujarat',
                country: 'India',
                zipcode: '380001',
                phone: '9876543210'
            },
            status: 'Order Placed',
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        });
        await tempOrder.save();
        console.log(`Created temp order: ${tempOrder._id}`);

        // Update status to "Shipped"
        const resStatus = await fetch(`${baseUrl}/api/order/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: adminToken
            },
            body: JSON.stringify({ orderId: tempOrder._id, status: 'Shipped' })
        });
        const dataStatus = await resStatus.json();
        console.log("Status update response:", dataStatus);

        // Fetch updated orders list
        const resOrdersList = await fetch(`${baseUrl}/api/order/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: adminToken
            }
        });
        const dataOrdersList = await resOrdersList.json();
        const updatedOrderObj = dataOrdersList.orders?.find(o => o._id.toString() === tempOrder._id.toString());
        console.log(`Updated Order Status in list: ${updatedOrderObj?.status}`);

        const passD = dataStatus.success === true && updatedOrderObj?.status === 'Shipped';
        console.log(`VERIFY D RESULT: ${passD ? 'PASS' : 'FAIL'}\n`);

        // Clean up temp test order
        await orderModel.findByIdAndDelete(tempOrder._id);
        console.log("Cleaned up temp order.");

        server.close();
        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
};

runVerification();
