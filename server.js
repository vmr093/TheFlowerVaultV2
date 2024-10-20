// REQUIRMENTS

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const morgan = require("morgan");
const session = require('express-session');
const path = require("path");


const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");



// CONNECT TO MONGOOSE
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.FlowersTWO}.`);
  });

// MODELS

const Flower = require("./models/flowers.js")

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method")); 
app.use(morgan("dev"));
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(express.static(path.join(__dirname, "public")));

// ROUTES

app.get("/", async (req, res) => {
    res.render("index.ejs", {
      user:req.session.user,  
    });
  });

// BEGIN INDEX ROUTE

app.get("/flowers", async (req, res) => {
    const allFlowers = await Flower.find();
    res.render("flowers/index.ejs", {flowers: allFlowers});
  });

// END INDEX ROUTE

// BEGIN CREATE NEW FLOWER ROUTE

  app.get("/flowers/new", (req, res) => {
    res.render("flowers/new.ejs");
  });

  const createFlower = async (flowerData) => {
        try {
            const flower = new Flower(flowerData);
            await flower.save();
            console.log('Flower saved successfully:', flower);
            return flower;
        } catch (error) {
            console.error('Error saving flower:', error);
            throw error;
        }
    };

  app.post("/flowers", async (req, res) => {
    try {
        const flower = await createFlower(req.body);
        res.redirect("/flowers");
    } catch (error) {
        res.status(500).json({ message: 'Failed to create flower', error: error.message });
    }
  });

// END CREATE NEW FLOWER ROUTE


// BEGIN SHOW FLOWER ROUTE

app.get("/flowers/:flowerId", async (req, res) => {
    const foundFlower = await Flower.findById(req.params.flowerId);
    res.render("flowers/show.ejs", { flower: foundFlower });
  });


// END SHOW FLOWER ROUTE

// BEGIN DELETE FLOWER ROUTE

app.delete("/flowers/:flowerId", async (req, res) => {
    await Flower.findByIdAndDelete(req.params.flowerId);
    res.redirect("/flowers");
  });

// END DELETE FLOWER ROUTE

// BEGIN EDIT FLOWER ROUTE

app.get("/flowers/:flowerId/edit", async (req, res) => {
    const foundFlower = await Flower.findById(req.params.flowerId);
    res.render("flowers/edit.ejs", {
      flower: foundFlower,
    });
  });

app.put("/flowers/:flowerId", async (req, res) => {
    await Flower.findByIdAndUpdate(req.params.flowerId, req.body);
    res.redirect(`/flowers/${req.params.flowerId}`);
  });

// END EDIT FLOWER ROUTE

// CONNECT AUTH ROUTES

app.use("/auth", authController);



  


app.listen(4000, () => {
  console.log("Listening on port 4000");
});