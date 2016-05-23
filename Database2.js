/**
 * Created by Luca on 22/03/2016.
 */
var mongoose= require("mongoose");



module.exports=
{
//Establishes a connection to the Database
    connectDatabase: function (cb) {
        /* mongoose.connect('mongodb://localhost');
         var db = mongoose.connection;
         db.on('error', console.error.bind(console, 'connection error:'));
         db.once('open', function () {
         console.log("you are connected to the database, you can now do everything you want");
         });*/

        var mongoURI = "mongodb://localhost/test";
        var MongoDB = mongoose.connect(mongoURI).connection;
        MongoDB.on('error', function (err) {
            console.log(err.message);
        });
        MongoDB.once('open', function () {
            console.log("mongodb connection open");
            cb();
        });
    },

    connectDatabasebase: function (string) {
        /* mongoose.connect('mongodb://localhost');
         var db = mongoose.connection;
         db.on('error', console.error.bind(console, 'connection error:'));
         db.once('open', function () {
         console.log("you are connected to the database, you can now do everything you want");
         });*/

        var mongoURI = "mongodb://localhost";
        mongoURI = mongoURI + "/" + string;
        console.log(mongoURI);
        var MongoDB = mongoose.connect(mongoURI).connection;
        MongoDB.on('error', function (err) {
            console.log(err);
        });
        MongoDB.once('open', function () {
            console.log("mongodb connection open");
        });
    },
}
