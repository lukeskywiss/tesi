
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rowrnaseqv2isoformquantificationSchema = new Schema({
        tumor : String,
        aliquote: String,
        person_id: String,
        tissue: String,
        chr : String,
        start : String,
        end : String,
        strand : String,
        gene_symbol : String,
        entrez_gene_id : String,
        transcript_id : String,
        raw_count : Number,
        scaled_estimate : Number,
        normalized_count : Number
    });

    var rnaseqv2isoformquantificationSchema = new Schema({
       fields: [rowrnaseqv2isoformquantificationSchema]
    });

var rnaseqv2isoformquantification = mongoose.model('rnaseqv2isoformquantification', rnaseqv2isoformquantificationSchema);
module.exports = rnaseqv2isoformquantification;