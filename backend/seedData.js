const mongoose = require("mongoose");

// SAME schema likh (import issue avoid karne ke liye)
const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const Food = mongoose.model("Food", foodSchema);

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/hungerhubDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// DATA
const foods = [
  {
    name: "Pizza",
    price: 250,
   

  },
  {
    name: "Burger",
    price: 120,
    
    
  },
  {
    name: "Biryani",
    price: 200,
    
  },
  {
    name: "Pasta",
    price: 180,
    
  },
  {
    name: "Noodles",
    price: 150,
    
  },
   {
    name: "Sushi",
    price: 150,
    image: "sushi.png"
  }
];

async function seedDB() {
  try {
    await Food.deleteMany(); // optional
    await Food.insertMany(foods);

    console.log("Data inserted ✅");
    process.exit();
  } catch (err) {
    console.log("Error:", err);
  }
}

seedDB();