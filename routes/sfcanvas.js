module.exports = function (app, secret) {
	
	 var https = require('https')
	  , url = require ('url');
	
	app.get('/go', function(req, res){
		res.render ('index');
	});

	
	app.post('/',  function(req, res){


		console.log ('got the post from salesforce');

		var   sreq = req.body.signed_request
			, sreq_split = sreq.split('.')
			, encodedSig = sreq_split[0]
			, encodedEnvelope = sreq_split[1]
			, crypto = require('crypto');

		var json_envelope = new Buffer(encodedEnvelope, 'base64').toString('utf8');
		console.log ('json envelope : ' + json_envelope);

		/*  verify signature  */
		var algorithm, canvasRequest;
		try {
			canvasRequest = JSON.parse(json_envelope);
			algorithm = canvasRequest.algorithm ? "HMACSHA256" : canvasRequest.algorithm;
		} catch (e) {
			throw 'Error deserializing JSON: '+ e;
		}

		// check algorithm - not relevant to error
		if (!algorithm || algorithm.toUpperCase() !== 'HMACSHA256') {
			throw 'Unknown algorithm '+algorithm+'. Expected HMACSHA256';
		}
  
		expectedSig = crypto.createHmac('sha256', secret).update(encodedEnvelope).digest('base64');
		if (encodedSig !== expectedSig) {
			throw 'Bad signed JSON Signature!';
		}

		res.render('index', {title: 'hello', signedreq : json_envelope});
	});
	
	
	
	/*** Doesn't Work, because all the relative URL resources in the page are not rewritten ***/
	app.get('/proxy', function(proxyReq, proxyResp) {
	    var params = url.parse(proxyReq.url, true);
	    console.log ('got : ' + params.query.src);
	    var URL = params.query.src;

	    var destParams = url.parse(URL);

	    var reqOptions = {
	        host : destParams.host,
	        port : 443,
	        path : destParams.pathname + destParams.search,
	        method : "GET"
	    };

	    console.log ('calling : ' + JSON.stringify( reqOptions));
	    var req = https.request(reqOptions, function(res) {
	        var headers = res.headers;
	        headers['Access-Control-Allow-Origin'] = '*';
	        headers['Access-Control-Allow-Headers'] = 'X-Requested-With';
	        proxyResp.writeHead(200, headers);
	        /* chunk will be a string, not a Buffer */
	        res.setEncoding('utf8');

	        res.on('data', function(chunk) {
	        	console.log ('got data');
	        	/* rewrite relative urls */
	        	var rewrite_chunk = chunk.replace(/src="\//g, 'src="https://'+ destParams.host + '/');   
	            proxyResp.write(rewrite_chunk);
	        });

	        res.on('end', function() {
	        	console.log ('got end');
	            proxyResp.end();
	        });
	    });

	    req.on('error', function(e) {
	        console.log('An error occured: ' + e.message);
	        proxyResp.writeHead(503);
	        proxyResp.write("Error!");
	        proxyResp.end();
	    });
	    req.end();

	});
	/* **/
	
};
