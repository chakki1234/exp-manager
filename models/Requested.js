var mongoose = require("mongoose");

var RequestedSchema = new mongoose.Schema({

rusername: String,
iamountp: Number,
status : String

})

module.exports = mongoose.model("Requested", RequestedSchema);