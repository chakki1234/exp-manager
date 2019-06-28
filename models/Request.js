var mongoose = require("mongoose");


var UsrSchema = new mongoose.Schema({

username: String,
iamountp : Number,
status : String
});




var RequestSchema = new mongoose.Schema({

tamount: Number,
rdescription: String,
divison: Number,
iamount: Number,
detailsusr: [UsrSchema]
});

module.exports = mongoose.model("Request", RequestSchema );
