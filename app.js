
/**
 * Keith Howling
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , solr = require('solr-client')
  , url = require ('url')
  , solr_url = url.parse(process.env.WEBSOLR_URL);

var app = express();


/* Setup Solr */
var client_opts = {
        path: solr_url.pathname,
        host: solr_url.hostname,
        port: 80
   };
if (solr_url.port) {
	client_opts.port = parseInt(solr_url.port);
}

console.log ('client_opts :' + JSON.stringify(client_opts));
var client = solr.createClient(client_opts);
client.autoCommit = true;

/* Setup Express */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);
app.use(express.favicon());
/*app.use(express.logger('dev')); */
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Access Routes
require('./routes/sfcanvas')(app, process.env.SFDC_SECRET);
		
// Solr WebServices
require('./routes/products')(app, client);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
