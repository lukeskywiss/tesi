var cnv = require('./model/cnv');


exports.addcnvtodatabase =function(objtoadd){
    var a= cnv(objtoadd);
    a.save(function(err){
        if (err) throw err;
    });
};