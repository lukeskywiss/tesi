
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
    // define schema
    var rnaseqexonquantificationSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "raw_counts": Number,
        "median_length_normalized": Number,
        "rpkm": Number

    });
    mongoose.model('rnaseqexonquantification', rnaseqexonquantificationSchema);
};