/**
 * Created by Luca on 11/03/2016.
 */

var fs= require('fs');
var path= require('path');
var databse = require('./Database');
var mongoose = require('mongoose');
var root2= "bed/brca/rnaseq/gene.quantification";
var async = require('async');
require('./Genome.js')();

require('./model/dnaseq.js')();
require('./model/cnv.js')();
require('./model/dnamethylation.js')();
require('./model/mirnaseq/mirnaseqisoformquantification.js')();
require('./model/mirnaseq/mirnaseqmirnaquantification.js')();
require('./model/rnaseq/rnaseqexonquantification.js')();
require('./model/rnaseq/rnaseqgenequantification.js')();
require('./model/rnaseq/rnaseqspljxnquantification.js')();
require('./model/rnaseqv2/rnaseqv2exonquantification.js')();
require('./model/rnaseqv2/rnaseqv2genequantification.js')();
require('./model/rnaseqv2/rnaseqv2isoformquantification.js')();
require('./model/rnaseqv2/rnaseqv2spljxnquantification.js')();



//create all the model for the varius experiment
var dnaseq = mongoose.model('dnaseq');
var cnv = mongoose.model('cnv');
var dnamethylation= mongoose.model('dnamethylation');
var mirnaseqisoformquantification = mongoose.model('mirnaseqisoformquantification');
var mirnaseqmirnaquantification = mongoose.model('mirnaseqmirnaquantification');
var rnaseqexonquantification = mongoose.model('rnaseqexonquantification');
var rnaseqgenequantification = mongoose.model('rnaseqgenequantification');
var rnaseqspljxnquantification= mongoose.model('rnaseqspljxnquantification');
var rnaseqv2exonquantification = mongoose.model('rnaseqv2exonquantification');
var rnaseqv2genequantification = mongoose.model('rnaseqv2genequantification');
var rnaseqv2isoformquantification = mongoose.model('rnaseqv2isoformquantification');
var rnaseqv2spljxnquantification = mongoose.model('rnaseqv2spljxnquantification');



//Find file in a Directory and in output show the file text
function findFile(rootOfFile, arrayParametri, cb){
    var output = [];
    path.normalize(rootOfFile);
    //entra nella condizione dopo il return perche??
    //è perchè è asincreono quindi continua tutto il codice e solo alla fine mi da il risultato??
    //così facendo però il returno è nullo come mi comporto?
    if( path.extname(rootOfFile)==".bed"){
        console.log("è il file bed che cerchi!!!");
        fs.readFile(rootOfFile, function(err, data){
            if(err){
                console.log(err);
            }
            //Non c'è la separazione delle righe.. tentare con un nuovo metodo che mantiene le righe distitnte
            var string= data.toString().split( /\r\n/g);//regex la condizione.
            var output= addLine(string,arrayParametri, rootOfFile);
            cb(output);
            var aggiungi=convertFromStringToJSON(output);

            /*            mongoose.connect('mongodb://localhost/genome', function(err) {
             if (err) throw err;

             async.each(aggiungi, function(item, cb) {
             Genome.create(item, cb);
             }, function(err) {
             if (err) {
             // handle error
             }
             });

             });*/
        });
    }
    else if (path.extname(rootOfFile)==".schema"){
        console.log("è il file header da cui prendere i campi!!!");
        var array= fs.readFileSync(rootOfFile).toString().split("\n");
        arrayParametri=findString(array);
        console.log("\n");
        cb(arrayParametri);
    }
    else{
        console.log("é un file che non devi leggere!!");
    }
}


//searches from the given path to a path that contains the file that we need
//Improvement needed "has to go in the else only if there are no more directorys"
function searchFileInDirectory(root){
    var temp=fs.readdirSync(root);
    console.log(temp);
    var check=0;
    var fields = [];
    fs.readdirSync(root).forEach(function(elem){

        /*  */
        var str=root + "/" + elem;
        if (fs.lstatSync(str).isDirectory()) {
            searchFileInDirectory(str);
        } else {
            str=path.normalize(str);
            if (path.extname(str)==".schema"){
                console.log("hai elaborato il file xml");
                check = 1;
                findFile(str,fields,function(giad){
                    fields = giad;
                });

            }
            else if(path.extname(str)== ".bed" && check==1){
                console.log("il file xml è stato elaborato già puoi elaborare il file .bed");
                findFile(str, fields, function(giad){
                })

            }
            else if(path.extname(str)== ".bed" && check==0){
                console.log("devi prima elaborare il file xml per andare avanti");
            }
            else{
                console.log("non è un file che ti interessa");
            }
        }
    })
}


//splits the xml file in columns and needs to find the fields needed
function findString(array) {
    var output= new Array();
    output.push("chr");
    output.push("start");
    output.push("end");
    for (i in array) {
        if (array[i].toString().indexOf("field") > -1) {
            string = array[i].toString().split("<");
            string = string[1].toString().slice(string[1].toString().lastIndexOf(">") + 1);
            output.push(string);
        }
    }//ritornare un array
    //console.log(output.length);
    return output;

};

//splits a string whenever it finds a \t arrayofString sono le righe del file
function addLine(arrayofString, fields, typeofexperiment){
    var output= [];

    for(var j = 0; j < arrayofString.length - 1; j++){
        var temp = arrayofString[j].toString().split("\t");

        var row = {};

        for (var i = 0; i < fields.length; i ++){
            row["" + fields[i]] = temp[i];
        }
        output.push(row);

        // databse.addDocumentToDatabase(row);
    }
    var aggiungi=convertFromStringToJSON(output);

    async.each(aggiungi, function(item, cb) {
        if(typeofexperiment.indexOf("dnaseq")>-1) {
            dnaseq.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("cnv")>-1) {
            cnv.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("dnamethylation")>-1) {
            dnamethylation.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("mirnaseq")>-1 && typeofexperiment.indexOf("isoform.quantification")>-1) {
            mirnaseqisoformquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("mirnaseq")>-1 && typeofexperiment.indexOf("mirna.quantification")>-1) {
            mirnaseqmirnaquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("exon.quantification")>-1) {
            rnaseqexonquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("gene.quantification")>-1) {
            rnaseqgenequantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1) {
            rnaseqspljxnquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("exon.quantification")>-1) {
            rnaseqv2exonquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("gene.quantification")>-1) {
            rnaseqv2genequantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("isoform.quantification")>-1) {
            rnaseqv2isoformquantification.create(item, cb);
            output.pop(item);
        }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1) {
            rnaseqv2spljxnquantification.create(item, cb);
            output.pop(item);
        }

    }, function(err) {
        if (err) {
            console.log("");
        }
    });


    return output;
};

//converts a Genome in a JSON file
function convertFromStringToJSON(string){
    stringForMongo = JSON.stringify(string);
    /*
     mongoose.connect('mongodb://localhost/genome', function(err) {
     if (err) throw err;
     */

    return stringForMongo;

};

function trovatipoesperimento(string){
    string

}

databse.connectDatabase();
searchFileInDirectory(root2);



