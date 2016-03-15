/**
 * Created by Luca on 11/03/2016.
 */
var http = require('http');
var fs = require('fs');



//404 response
function send404Response(response){
    response.writeHead(404, {"Content-Type":"text/plain" })
    response.write("Error 404 page not found");
    response.end();
}

// Handle a user request
function onRequest(request, response){

    if(request.method== "GET" && request.url=="/"){
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.createReadStream("./index.html").pipe(response)
    }
    else{
        send404Response(response);
    }

    //console.log("A user made a request" + request.url);
   // response.writeHead(200,{"Context-Type":"text/html"});
   // response.write("Here is your response");
   // response.end();

}

http.createServer(onRequest).listen(8888);
console.log("Server is rugnning");