/**
 * Created by Luca on 11/03/2016.
 */

var fs= require('fs');
var path= require('path');

var root2= "bed";

//Find file in a Directory and in output show the file text
function findFile(root, arrayParametri, cb){
    var output = [];
    path.normalize(root);
    //entra nella condizione dopo il return perche??
    //è perchè è asincreono quindi continua tutto il codice e solo alla fine mi da il risultato??
    //così facendo però il returno è nullo come mi comporto?
    if( path.extname(root)==".bed"){
        console.log("è il file bed che cerchi!!!");
        fs.readFile(root, function(err, data){
            if(err){
                console.log(err);
            }
            //Non c'è la separazione delle righe.. tentare con un nuovo metodo che mantiene le righe distitnte
            string= data.toString().split( /\r\n/g);//regex la condizione.

            output= addLine(string);
            cb(output);
            convertFromStringToJSON(output);
        })
    }
    else if (path.extname(root)==".schema"){
        console.log("è il file header da cui prendere i campi!!!");
        var array= fs.readFileSync(root).toString().split("\n");
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
function searchFileInDirectory(path){
    if (fs.lstatSync(path).isDirectory()){
        console.log("è una cartella");
        console.log(fs.readdirSync(path));
        fs.readdirSync(path).forEach(function (elem){
            searchFileInDirectory(path + "/" + elem);
        });
    }
    else{
        var output;
        findFile(path,output, function(giad){
            giad;
        });
    }
};

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
    console.log(output);
    return output;

};

//splits a string whenever it finds a \t characther
function addLine(arrayofString){
    var output= [];
    for (i in arrayofString){
        output.push(arrayofString[i].toString().split("\t"));
    }
    return output;
};

//converts a Genome in a JSON file
function convertFromStringToJSON(string){
    stringForMongo = JSON.stringify(string);
    console.log(stringForMongo);
    console.log("\n");
};



searchFileInDirectory(root2);


