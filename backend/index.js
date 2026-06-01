const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const User = require("./models/Users");
const Order = require("./models/Order");
const Food = require('./models/Food');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/hungerhubDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// 🔐 ADMIN MIDDLEWARE
const isAdmin = (req, res, next) => {
  const role = req.headers.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied ❌" });
  }

  next();
};



// ================== ORDER API (FINAL) ==================
// ================== ORDER API (FINAL) ==================
app.post("/order", async (req, res) => {
  try {
    console.log("BODY AA RHI HAI:", req.body); // 🔥 DEBUG

    const { name, mobile, foodName, price, quantity } = req.body;

    // ❌ agar data nahi aaya toh error throw karo
    if (!foodName || !price) {
      return res.status(400).json({
        success: false,
        message: "foodName or price missing ❌"
      });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ name, mobile });
    }

    const order = await Order.create({
      userId: user._id,
      foodName,
      price,
      quantity
    });

    res.json({ success: true, order });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ success: false });
  }
});



// ================== ADD FOOD ==================
app.post("/order", async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);

    const { name, mobile, foodName, price, quantity } = req.body;

    if (!foodName || !price) {
      return res.status(400).json({
        success: false,
        message: "Food name or price missing"
      });
    }
    console.log("FOOD:", food);
    // user check
    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        name,
        mobile
      });
    }

    // order save
    const order = await Order.create({
      userId: user._id,
      foodName,
      price,
      quantity
    });

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false
    });
  }
});



// ================== GET ALL ORDERS ==================
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});



// ================== SEARCH ==================
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      const allFoods = await Food.find();
      return res.json(allFoods);
    }

    const foods = await Food.find({
      name: { $regex: query, $options: "i" }
    });

    res.json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Search failed" });
  }
});



// ================== GET ALL FOOD ==================
app.get("/getfood", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).send("Error fetching food");
  }
});



// ================== DELETE FOOD ==================
app.delete("/deletefood/:id", isAdmin, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.send("Food Deleted ❌");
  } catch (error) {
    res.status(500).send("Error deleting food");
  }
});



// ================== UPDATE FOOD ==================
app.put("/updatefood/:id", isAdmin, async (req, res) => {
  try {
    const { name, price, image } = req.body;

    await Food.findByIdAndUpdate(req.params.id, {
      name,
      price,
      image
    });

    res.send("Food Updated ✅");
  } catch (error) {
    res.status(500).send("Error updating food");
  }
});



// ================== SERVER ==================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
}); 