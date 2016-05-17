
var database = require('./Database.js');
var dnaseq = require('./model/dnaseq');


function search(){
    database.dnaseq.find({ tumor: 'brca', chr:'chr6'})
}


search();
