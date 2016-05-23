// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
    // define schema
    var rowrnaseqgenequantificationSchema = new Schema({
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
        raw_counts : Number,
        median_length_normalized : Number,
        rpkm : Number
    });

    var rnaseqgenequantificationSchema= new Schema({
        fields: [rowrnaseqgenequantificationSchema]
    });

    var rnaseqgenequantification = mongoose.model('rnaseqgenequantification', rnaseqgenequantificationSchema);
module.exports = rnaseqgenequantification;