import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/db/db.js";

// routes
import userRouters from "./src/routes/user.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONEND_URL,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use("/api/v1/auth", userRouters);


app.get("/", (req, res) => {
    res.json({ success: true, message: "Hello from discord" });
});

connectDB()
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
