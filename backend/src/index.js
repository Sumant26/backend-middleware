import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config({
    path: "./.env",
});

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    } catch (error) {
        console.log("Server startup failed", error.message);
    }
};

startServer();
