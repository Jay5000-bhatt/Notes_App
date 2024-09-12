import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectDB from "./Config/ConnectDB.js";
import userRoutes from "./Routes/UserRoutes.js";
import noteRoutes from "./Routes/NoteRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

ConnectDB();

// Root route handler
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/user", userRoutes);
app.use("/note", noteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
