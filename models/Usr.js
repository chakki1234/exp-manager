var mongoose = require("mongoose");

var UsrSchema = new mongoose.Schema({

username: String,
iamountp : Number,
status : String
});

module.exports = mongoose.model("Usr", UsrSchema);
