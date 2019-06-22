var mongoose = require("mongoose");

var ExpenseSchema =  new mongoose.Schema({

title : String,
description : String,
amount : Number

});

module.exports = mongoose.model("Expense", ExpenseSchema );