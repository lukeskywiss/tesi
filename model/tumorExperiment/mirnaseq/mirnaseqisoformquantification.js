

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rowmirnaseqisoformquantificationSchema = new Schema({
        tumor : String,
        aliquote: String,
        person_id: String,
        tissue: String,
        chr: String,
        start: String,
        end: String,
        strand: String,
        mirna_id: String,
        read_count : Number,
        reads_per_million_miRNA_mapped: Number,
        cross_mapped: String,
        miRNA_region: String
    });

    var mirnaseqisoformquantificationSchema = new Schema({
        fields: [rowmirnaseqisoformquantificationSchema]
    });

var mirnaseqisoformquantification = mongoose.model('mirnaseqisoformquantification', mirnaseqisoformquantificationSchema);

module.exports = mirnaseqisoformquantification;
