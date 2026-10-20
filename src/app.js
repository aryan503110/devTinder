import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js"

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/user", profileRoutes);
app.use("/connection", connectionRoutes);

app.listen(3000, () => {
  console.log(`Server running on Port 3000`);
});
