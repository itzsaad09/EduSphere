import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cludinary.js";
import registrationRoute from "./routes/registrationRoutes.js";
import coursesRoute from "./routes/courseRoutes.js";
import enrollmentRoute from "./routes/enrollmentRoutes.js";
import certificateRoute from "./routes/certificateRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 8000;

connectDB()
connectCloudinary()

// Middleware
app.use(cors());
app.use(express.json());

// App endpoints
app.use("/api/auth", registrationRoute);
app.use('/api/courses', coursesRoute)
app.use('/api/enrollment', enrollmentRoute)
app.use('/api/certificate', certificateRoute)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
});
