var http=require('http');
var https=require('https');
var url=require('url');
var string_decoder=require('string_decoder').StringDecoder;
var config=require('./config');
var fs=require('fs');

// instantiating http server
var httpServer=http.createServer(function(req,res){	
	unifiedserver(req,res);
	
});

//start the http server and have it listen on port 3000
httpServer.listen(config.httpPort,function(){
	console.log("server is listening on port "+ config.httpPort+" in "+ config.envName);
});

// instantiating http server
var httpsServerOption={
	"key":fs.readFileSync('./https/key.pem'),
	"cert":fs.readFileSync('./https/cert.pem'),
};
var httpsServer=https.createServer(httpsServerOption,function(req,res){
	
	unifiedserver(req,res);
	
});

//start the http server and have it listen on port 3001
httpsServer.listen(config.httpsPort,function(){
	console.log("server is listening on port "+ config.httpsPort+" in "+ config.envName);
});


var unifiedserver=function(req,res){
	
	
	var parsedurl=url.parse(req.url,true);
	var path=parsedurl.pathname;
	
	var trimmedpath=path.replace(/^\/+|\/+$/g,'');
	
	var method=req.method.toLowerCase();
	
	var queryString=parsedurl.query;
	
	var headers=req.headers;
	
	var decoder=new string_decoder('utf-8');
	var buffer='';
	req.on('data',function(data){
		buffer+=decoder.write(data);
	});
	req.on('end',function(){
		buffer +=decoder.end();
		
	var chosenHandler=typeof(router[trimmedpath])!=='undefined' ? router[trimmedpath] : handlers.notFound;
	var data={
		'trimmedpath':trimmedpath,
		'queryStringObject':queryString,
		'method':method,
		'headers':headers,
		'payload':buffer
	}
	chosenHandler(data,function(statusCode,payload){
		statusCode=typeof(statusCode)=='number' ? statusCode : 200;
		payload=typeof(payload)=='object' ? payload : {};
		var payloadString=JSON.stringify(payload);
			res.setHeader('content-type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			console.log("return response ",statusCode,payloadString);
	  });
	
	});
	
};

//Define the handlers
var handlers={};
//ping handler
handlers.ping=function(data,callback){
	callback(200);
};
handlers.hello=function(data,callback){
	callback(200,{'message':'Welcome!! This is Harsha From :Pirple'})
};


//not found handlers
handlers.notFound=function(data,callback){
	callback(404);
}
//define request router
var router={
	'ping':handlers.ping,
	'hello':handlers.hello
};