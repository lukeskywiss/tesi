/**
 * Created by Luca on 11/03/2016.
 */

var fs= require('fs');
var path= require('path');
var databse = require('./Database');
var mongoose = require('mongoose');
var root2= "bed";
var async = require('async');


var dnaseq = require('./model/tumorExperiment/dnaseq');
var cnv = require('./model/tumorExperiment/cnv');
var dnamethylation = require('./model/tumorExperiment/dnamethylation');
var mirnaseqisoformquantification = require('./model/tumorExperiment/mirnaseq/mirnaseqisoformquantification');
var mirnaseqmirnaquantification = require('./model/tumorExperiment/mirnaseq/mirnaseqmirnaquantification');
var rnaseqexonquantification = require('./model/tumorExperiment/rnaseq/rnaseqexonquantification');
var rnaseqgenequantification = require('./model/tumorExperiment/rnaseq/rnaseqgenequantification');
var rnaseqspljxnquantification = require('./model/tumorExperiment/rnaseq/rnaseqspljxnquantification');
var rnaseqv2exonquantification = require('./model/tumorExperiment/rnaseqv2/rnaseqv2exonquantification');
var rnaseqv2genequantification = require('./model/tumorExperiment/rnaseqv2/rnaseqv2genequantification');
var rnaseqv2isoformquantification = require('./model/tumorExperiment/rnaseqv2/rnaseqv2isoformquantification');
var rnaseqv2spljxnquantification = require('./model/tumorExperiment/rnaseqv2/rnaseqv2spljxnquantification');

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
        doall(arrayParametri,rootOfFile);
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
    output.push("tumor");
    output.push("aliquote");
    output.push("person_id");
    output.push("tissue");
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
    var tumorName= typeofexperiment.split(path.sep);
    var aliquote =path.parse(typeofexperiment);
    var personidandTissue= aliquote.name.split("-");

    row[""+ fields[0]]=tumorName[1];
    row[""+ fields[1]]=aliquote.name;
    row[""+ fields[2]]=personidandTissue[0]+"-"+personidandTissue[1]+"-"+personidandTissue[2];
    row[""+ fields[3]]=personidandTissue[3];
    for (var i = 4; i < fields.length; i++) {
        row["" + fields[i]] = temp[i-4];
    }
    return row;

};



//converts a Genome in a JSON file
function convertFromStringToJSON(string){
    stringForMongo = JSON.stringify(string);
    return stringForMongo;
};

function findModel(typeofexperiment) {

    if (typeofexperiment.indexOf("dnaseq") > -1) {
        return new dnaseq();
    } else if (typeofexperiment.indexOf("cnv") > -1) {
        return new cnv();
    } else if (typeofexperiment.indexOf("dnamethylation") > -1) {
        return new dnamethylation();
    } else if (typeofexperiment.indexOf("mirnaseq") > -1 && typeofexperiment.indexOf("isoform.quantification") > -1) {
        return new mirnaseqisoformquantification();
    } else if (typeofexperiment.indexOf("mirnaseq") > -1 && typeofexperiment.indexOf("mirna.quantification") > -1) {
        return new mirnaseqmirnaquantification();
    } else if (typeofexperiment.indexOf("rnaseq") > -1 && typeofexperiment.indexOf("exon.quantification") > -1 && typeofexperiment.indexOf("v2")<0) {
        return new rnaseqexonquantification();
    }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("gene.quantification")>-1 && typeofexperiment.indexOf("v2")<0) {
        return new rnaseqgenequantification();
    }else if(typeofexperiment.indexOf("rnaseq")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1 && typeofexperiment.indexOf("v2")<0) {
        return new rnaseqspljxnquantification();
    }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("exon.quantification")>-1) {
        return new rnaseqv2exonquantification();
    }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("gene.quantification")>-1) {
        return new rnaseqv2genequantification();
    }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("isoform.quantification")>-1) {
        return new rnaseqv2isoformquantification();
    }else if(typeofexperiment.indexOf("rnaseqv2")>-1 && typeofexperiment.indexOf("spljxn.quantification")>-1) {
        return new rnaseqv2spljxnquantification();
    }
};


function doall(arrayParametri, rootOfFile){
    var arr =[];
    var stream = fs.createReadStream(rootOfFile);
    var s = linestream("\n");
    var j =25000;
    var count=0;
    s.on('data',function(line){
        stream.pause();
        s.pause();

        var output= addLine(line+'', arrayParametri, rootOfFile);
        arr.push(output);
        j = j-1;

        if (j==0){
            var gene = findModel(rootOfFile);
            arr.forEach(function(item) {
                gene.fields.push(item);
            });
            arr.length=0;
            j=25000;
            count =count + j;
            gene.save(function(err){
                if(!err){console.log("saved the first "+ count + " rows of the file "+ rootOfFile);
                };
            });
        }
        stream.resume();
        s.resume();
    });

    stream.on('end', function(){
        count =25000 - j;
        var gene = findModel(rootOfFile);
        arr.forEach(function(item){
            gene.fields.push(item);
        });
        gene.save(function (err) {
            if (!err) console.log('Success!saved '+ count +" rows of " +rootOfFile.toString());
            arr.length=0;
        });
    });
    stream.pipe(s);
};

databse.connectDatabase(function (){
    searchFileInDirectory(root2);
});
