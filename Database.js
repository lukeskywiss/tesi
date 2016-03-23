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

    createSchema: function(array){
        var Genome = mongoose.Schema({

        });
    },

    addFileToDatabase: function(array){

    },

}
//exports function for the databse
