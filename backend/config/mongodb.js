import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("DB connected")
    })

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing. Add it in backend/.env")
        process.exit(1)
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'jhanvi_collection',
        })
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message)
        console.error("👉 Check: 1) password in MONGODB_URI, 2) Atlas Network Access IP whitelist (allow 0.0.0.0/0), 3) database user credentials.")
        process.exit(1)
    }
}

export default connectDB