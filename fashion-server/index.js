const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

// middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/FashionData")
.then(() => {
    console.log("MongoDB connected");
})
.catch(err => {
    console.log(err);
});

// Fashion Schema
const FashionSchema = new mongoose.Schema({
    title: String,
    details: String,
    thumbnail: String,
    style: String,
    code: String,
    price: Number,
    createdAt: { type: Date, default: Date.now }
});

const Fashion = mongoose.model("Fashion", FashionSchema, "Fashion");


// API 1: get all fashions - sorted by createdAt descending
app.get("/fashions", async (req, res) => {
    try {
        console.log("GET /fashions requested"); 
        const data = await Fashion.find().sort({ createdAt: -1 });
        console.log("Found fashions count:", data.length);
        res.json(data);
    } catch (err) {
        console.error("Error getting fashions:", err);
        res.status(500).json({ error: err.message });
    }
});

// API 2: filter by style
app.get("/fashions/style/:style", async (req, res) => {
    const style = req.params.style;
    const data = await Fashion.find({ style: style }).sort({ createdAt: -1 });
    res.json(data);
});

// API 3: get fashion by id
app.get("/fashions/:id", async (req, res) => {
    try {
        const data = await Fashion.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Fashion not found" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API 4: add new fashion
app.post("/fashions", async (req, res) => {
    try {
        const newFashion = new Fashion(req.body);
        const saved = await newFashion.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API 5: update fashion
app.put("/fashions/:id", async (req, res) => {
    try {
        const updated = await Fashion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Fashion not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API 6: delete fashion by id
app.delete("/fashions/:id", async (req, res) => {
    try {
        const deleted = await Fashion.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Fashion not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// run server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});