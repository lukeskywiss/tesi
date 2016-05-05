
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
    // define schema
    var rnaseqspljxnquantificationSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "raw_counts": Number,
        "inner_left" : Number,
        "inner_right": Number

    });
    mongoose.model('rnaseqspljxnquantification', rnaseqspljxnquantificationSchema);
};