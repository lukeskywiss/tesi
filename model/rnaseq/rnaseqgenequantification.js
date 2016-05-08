// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
    // define schema
    var rnaseqgenequantificationSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "gene_symbol": String,
        "entrez_gene_id": String,
        "raw_counts": Number,
        "median_length_normalized": Number,
        "rpkm": Number
    });
    var rnaseqgenequantification = mongoose.model('rnaseqgenequantification', rnaseqgenequantificationSchema);
module.exports = rnaseqgenequantification;