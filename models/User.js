var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({

  username: { type: String, unique: true },
  password: String,
  moneysp: Number,
  balance: Number,
  expenses: [{
  	       type: mongoose.Schema.Types.ObjectId,
  	       ref: "Expense"
  }]

 });

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", UserSchema);
