
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
    // define schema
    var rnaseqv2isoformquantificationSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "gene_symbol": String,
        "entrez_gene_id": String,
        "transcript_id": String,
        "raw_count": Number,
        "scaled_estimate": Number,
        "normalized_count": Number

    });
    mongoose.model('rnaseqv2isoformquantification', rnaseqv2isoformquantificationSchema);
};