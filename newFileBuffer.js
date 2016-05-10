/**
 * Created by Luca on 11/03/2016.
 */

var fs= require('fs');
var path= require('path');
var databse = require('./Database');
var mongoose = require('mongoose');
var root2= "bed";
var async = require('async');
require('./Genome.js')();

var dnaseq = require('./model/dnaseq');
var cnv = require('./model/cnv');
var dnamethylation = require('./model/dnamethylation');
var mirnaseqisoformquantification = require('./model/mirnaseq/mirnaseqisoformquantification');
var mirnaseqmirnaquantification = require('./model/mirnaseq/mirnaseqmirnaquantification');
var rnaseqexonquantification = require('./model/rnaseq/rnaseqexonquantification');
var rnaseqgenequantification = require('./model/rnaseq/rnaseqgenequantification');
var rnaseqspljxnquantification = require('./model/rnaseq/rnaseqspljxnquantification');
var rnaseqv2exonquantification = require('./model/rnaseqv2/rnaseqv2exonquantification');
var rnaseqv2genequantification = require('./model/rnaseqv2/rnaseqv2genequantification');
var rnaseqv2isoformquantification = require('./model/rnaseqv2/rnaseqv2isoformquantification');
var rnaseqv2spljxnquantification = require('./model/rnaseqv2/rnaseqv2spljxnquantification');

var linestream = require('line-stream');
/*var s = linestream();*/

//create all the model for the varius experiment
var cnvsaver = require('./cnvsaver.js');


//Find file in a Directory and in output show the file text
function findFile(rootOfFile, arrayParametri, cb){

    path.normalize(rootOfFile);
    //entra nella condizione dopo il return perche??
    //è perchè è asincreono quindi continua tutto il codice e solo alla fine mi da il risultato??
    //così facendo però il returno è nullo come mi comporto?
    if( path.extname(rootOfFile)==".bed"){
        var stream = fs.createReadStream(rootOfFile);
        var s = linestream();
        s.on('data',function(line){
            stream.pause();
            s.pause();
            var output= addLine(line+'', arrayParametri, rootOfFile);
                addtodatabase(output,rootOfFile, function (){
                    stream.resume();
                    s.resume();
                });

        });
        stream.pipe(s);

        /* console.log("è il file bed che cerchi!!!");
         fs.readFile(rootOfFile, function(err, data){
             if(err){
                 console.log(err);
             }
             //Non c'è la separazione delle righe.. tentare con un nuovo metodo che mantiene le righe distitnte
             string= data.toString().split( /\r\n/g);//regex la condizione.
             output= addLine(string,arrayParametri, rootOfFile);
             cb(output);
             var aggiungi=convertFromStringToJSON(output);

             /!*            mongoose.connect('mongodb://localhost/genome', function(err) {
              if (err) throw err;

              async.each(aggiungi, function(item, cb) {
              Genome.create(item, cb);
              }, function(err) {
              if (err) {
              // handle error
              }
              });

              });*!/
         })*/;
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

            string = string.replace("-", "_");
            output.push(string);
        }
    }//ritornare un array
    //console.log(output.length);
    return output;

};

//splits a string whenever it finds a \t arrayofString sono le righe del file
function addLine(arrayofString, fields, typeofexperiment) {

    arrayofString = arrayofString.replace(/\r\n/g, '');


    var temp = arrayofString.toString().split("\t");

    var row = {};

    for (var i = 0; i < fields.length; i++) {
        row["" + fields[i]] = temp[i];
    }
    return row;

};

        // databse.addDocumentToDatabase(row);

function addtodatabase(objtoadd, typeofexperiment, cb) {

    if (typeofexperiment.indexOf("dnaseq") > -1) {
        adddnaseqtodatabse(objtoadd);
        cb();
    } else if (typeofexperiment.indexOf("cnv") > -1) {
        cnvsaver.addcnvtodatabase(objtoadd);
        cb();
    } else if (typeofexperiment.indexOf("dnamethylation") > -1) {
        var o = new dnamethylation(objtoadd);
        o.save(objtoadd, function (err) {
            if (err) throw err;
            delete o;
            delete objtoadd;
            cb();
        });

    } else if (typeofexperiment.indexOf("mirnaseq") > -1 && typeofexperiment.indexOf("isoform.quantification") > -1) {
        var o = new mirnaseqisoformquantification(objtoadd);
        o.save(function (err) {
            if (err) throw err;
            delete o;
            delete objtoadd;
            cb();
        });
    } else if (typeofexperiment.indexOf("mirnaseq") > -1 && typeofexperiment.indexOf("mirna.quantification") > -1) {
        var o = new mirnaseqmirnaquantification(objtoadd);
        o.save(function (err) {
            if (err) throw err;
            delete o;
            delete objtoadd;
            cb();
        });
    } else if (typeofexperiment.indexOf("rnaseq") > -1 && typeofexperiment.indexOf("exon.quantification") > -1) {
        var o = rnaseqexonquantification(objtoadd);
        o.save(function (err) {
            if (err) throw err;
            delete o;
            delete objtoadd;
            cb();
        });
    }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("gene.quantification")>-1) {
     var o = new rnaseqgenequantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1) {
     var o = new rnaseqspljxnquantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("exon.quantification")>-1) {
     var o = new rnaseqv2exonquantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("gene.quantification")>-1) {
     var o = new rnaseqv2genequantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("isoform.quantification")>-1) {
     var o = new rnaseqv2isoformquantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1) {
     var o = new rnaseqv2spljxnquantification(objtoadd);
     o.save(function(err) {
     if (err) throw err;
         delete o;
         delete objtoadd;
         cb();
     });
     }
};

//converts a Genome in a JSON file
function convertFromStringToJSON(string){
    var stringForMongo = JSON.stringify(string);
    JSON.parse(stringForMongo);
    console.log(stringForMongo);
    /*
     mongoose.connect('mongodb://localhost/genome', function(err) {
     if (err) throw err;
     */

    console.log("\n");
    return stringForMongo;

};

function adddnaseqtodatabse(objtoadd) {
    var o = new dnaseq(objtoadd);
    o.save(function (err) {
        if (err) throw err;
        delete o;
        delete objtoadd;
    });
};


databse.connectDatabase(function (){
    searchFileInDirectory(root2);
});




