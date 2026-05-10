require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/", authRoutes);
app.use("/", resumeRoutes);
app.use("/", jobMatchRoutes);
app.use("/", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
