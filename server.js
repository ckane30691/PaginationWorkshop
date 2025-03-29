const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { getUsers, getUsersOffsetBased, getUsersCursorBased } = require("./controllers/userController");

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes
app.get("/users", getUsersCursorBased);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});