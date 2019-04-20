var express = require('express'),
    async = require('async'),
    pg = require("pg"),
    path = require("path"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

io.set('transports', ['polling']);

var port = process.env.PORT || 4000;

io.sockets.on('connection', function (socket) {

  socket.emit('message', { text : 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

async.retry(
  {times: 1000, interval: 1000},
  function(callback) {
    pg.connect('postgres://postgres@db/postgres', function(err, client, done) {
      if (err) {
        console.error("Waiting for db");
      }
      callback(err, client);
    });
  },
  function(err, client) {
    if (err) {
      return console.error("Giving up");
    }
    console.log("Connected to db");
    getTeme(client);
  }
);

function getTeme(client) {
  client.query('SELECT nume, grupa, tema FROM teme', [], function(err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      var teme = collectTemeFromResult(result);
      io.sockets.emit("teme", JSON.stringify(teme));
    }

    setTimeout(function() {getTeme(client) }, 1000);
  });
}

function collectTemeFromResult(result) {
  var temele = [];

  result.rows.forEach(function (row) {
    var temaObj = { nume : row.nume, grupa : row.grupa, tema : row.tema};
    temele.push(temaObj);
  });

  return temele;
}

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});
