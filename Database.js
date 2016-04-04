/**
 * Created by Luca on 22/03/2016.
 */
var mongoose = require('mongoose');



module.exports=
{
//Establishes a connection to the Database
    connectDatabase: function(){
        mongoose.connect('mongodb://localhost/test');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("you are connected to the database, you can now do everything you want");
        });
    },


    //creats a Schema with the 3 standards fields,
    // the other fields that change every time are added anyway

    createSchema: function() {
        var Schema = mongoose.Schema;
        var Genome = new Schema({
            "char": String,
            "start": String,
            "end": String,
            "strand": String,
            "hugo_symbol": String,
            "entrez_gene_id": String,
            "variant_classification": String,
            "variant_type": String,
            "reference_allele": String,
            "tumor_seq_allele1": String,
            "tumor_seq_allele2": String,
            "dbsnp_rs": String,
            "tumor_sample_barcode": String,
            "matched_norm_sample_barcode": String,
            "match_norm_seq_allele1": String,
            "match_norm_seq_allele2": String,
            "matched_norm_sample_uuid": String
        });
        var Genome = mongoose.model('Genome', Genome);
    },

    addDocumentToDatabase: function(row){

        var Genome = mongoose.model('Genome');

        console.log(row);
        var gen= new Genome(row);

        gen.save(function(error, gen){
            if(error)
                res.json(error);
            else
                res.json(gen);
        })
    },
}
//exports function for the databse
