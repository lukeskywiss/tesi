
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rowrnaseqspljxnquantificationSchema = new Schema({
        tumor : String,
        aliquote: String,
        person_id: String,
        tissue: String,
        chr : String,
        start : String,
        end : String,
        strand : String,
        raw_counts : Number,
        inner_left : Number,
        inner_right : Number
    });

    var rnaseqspljxnquantificationSchema = new Schema({
       fields: [rowrnaseqspljxnquantificationSchema]
    });

  var rnaseqspljxnquantification =  mongoose.model('rnaseqspljxnquantification', rnaseqspljxnquantificationSchema);
module.exports = rnaseqspljxnquantification;