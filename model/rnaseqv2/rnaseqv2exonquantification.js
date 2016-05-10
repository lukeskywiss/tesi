
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rnaseqv2exonquantificationSchema = new Schema({
        chr : String,
        start : String,
        end : String,
        strand : String,
        raw_counts : Number,
        median_length_normalized : Number,
        rpkm : Number

    });
   var rnaseqv2exonquantification =  mongoose.model('rnaseqv2exonquantification', rnaseqv2exonquantificationSchema);
module.exports = rnaseqv2exonquantification;