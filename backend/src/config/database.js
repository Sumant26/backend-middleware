import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
};

export default connectDB;
