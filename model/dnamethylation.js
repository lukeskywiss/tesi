/**
 * Created by Luca on 05/04/2016.
 */
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var dnamethylationSchema = new Schema({
        chr: String,
        start: String,
        end: String,
        strand: String,
        composite_element_ref: String,
        beta_value: Number,
        gene_symbol: String
    });
    var dnamethylation=mongoose.model('dnamethylation', dnamethylationSchema);
module.exports= dnamethylation;
