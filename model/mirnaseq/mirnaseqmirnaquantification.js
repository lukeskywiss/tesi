// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var mirnaseqmirnaquantificationSchema = new Schema({
        tumor : String,
        chr : String,
        start : String,
        end : String,
        strand : String,
        mirna_id : String,
        read_count : Number,
        reads_per_million_miRNA_mapped: Number,
        cross_mapped : String
    });
    var mirnaseqmirnaquantification = mongoose.model('mirnaseqmirnaquantification', mirnaseqmirnaquantificationSchema);
module.exports = mirnaseqmirnaquantification;
