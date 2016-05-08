

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var mirnaseqisoformquantificationSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "mirna_id": String,
        "read_count" : Number,
        "reads_per_million_miRNA_mapped": Number,
        "cross-mapped": String,
        "miRNA_region": String
    });
    var mirnaseqisoformquantification = mongoose.model('mirnaseqisoformquantification', mirnaseqisoformquantificationSchema);

module.exports = mirnaseqisoformquantification;
