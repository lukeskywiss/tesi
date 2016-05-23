
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
    // define schema
    var rowrnaseqexonquantificationSchema = new Schema({
        tumor : String,
        aliquote: String,
        person_id: String,
        tissue: String,
        chr : String,
        start : String,
        end : String,
        strand : String,
        raw_counts : Number,
        median_length_normalized : Number,
        rpkm: Number
    });

    var rnaseqexonquantificationSchema = new Schema({
        fields: [rowrnaseqexonquantificationSchema]
    });

    var rnaseqexonquantification = mongoose.model('rnaseqexonquantification', rnaseqexonquantificationSchema);
module.exports = rnaseqexonquantification;