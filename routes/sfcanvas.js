module.exports = function (app) {
	
	app.get('/go', function(req, res){
		res.render ('index');
	});

	
	app.post('/',  function(req, res){


		console.log ('got the post from salesforce');

		var   sreq = req.body.signed_request
			, sreq_split = sreq.split('.')
			, encodedSig = sreq_split[0]
			, encodedEnvelope = sreq_split[1];

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

		res.render('index', {title: 'hello', signedreq : canvasRequest});
	});
	
};