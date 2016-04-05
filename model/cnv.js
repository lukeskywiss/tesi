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
module.exports = function() {
    // define schema
    var cnvSchema = new Schema({
        "chr": String,
        "start": String,
        "end": String,
        "strand": String,
        "Num_Probes": Number,
        "Segment_Mean": Number,
        "is_nocnv":String
    });
    mongoose.model('cnv', cnvSchema);
};


