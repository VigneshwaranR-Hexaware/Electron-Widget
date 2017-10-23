var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.send("/richowebsites");
});

app.get('/richowebsite', function(req, res) {
  res.sendfile(__dirname + '/myricoh.html');
});
app.get('/success', function(req, res) {
  res.sendfile(__dirname + '/success.html');
});
app.get('/chat', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
//code to enable google signin in login template
app.get('/fbhtml', function(req, res) {
  res.sendfile(__dirname + '/googlelogin.html');
});

app.listen(3000);