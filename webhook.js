  var express = require('express'),
  app = express(),
  path = require('path');
  
  http = require('http'),
  httpServer = http.Server(app);

  var multer = require("multer");
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads'); // set the destination
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + path.extname(file.originalname)); // set the file name and extension
    }
  });
  var upload = multer({ storage: storage });


app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.send("/richowebsites");
});

app.post("/upload", upload.single('imagename'), function (req, res) {
  if(req.file) {
    res.send(req.file.filename);
  } else {
    res.send();
  }
  
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