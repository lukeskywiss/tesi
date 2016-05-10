// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rnaseqv2spljxnquantificationSchema = new Schema({
        chr : String,
        start : String,
        end : String,
        strand : String,
        raw_counts : Number,
        inner_left : Number,
        inner_right : Number

    });
 var rnaseqv2spljxnquantification = mongoose.model('rnaseqv2spljxnquantification', rnaseqv2spljxnquantificationSchema);
module.exports = rnaseqv2spljxnquantification;