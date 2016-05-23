/**
 * Created by Luca on 05/04/2016.
 */
/**
 * Created by Luca on 05/04/2016.
 */
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

    // define schema
    var rowcnvSchema = new Schema({
        tumor : String,
        aliquote: String,
        person_id: String,
        tissue: String,
        chr: String,
        start: String,
        end: String,
        strand: String,
        Num_Probes: Number,
        Segment_Mean: Number,
        is_nocnv:String
    });

var cnvSchema = new Schema({
    fields:[rowcnvSchema]
});

      var cnv =mongoose.model('cnv', cnvSchema);
module.exports= cnv;



