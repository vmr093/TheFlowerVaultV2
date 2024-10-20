const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
    name: String,
    gardeningDifficulty: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added user reference
});


const Flower = mongoose.model("Flower", flowerSchema);

module.exports = Flower;