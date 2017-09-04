// IoT Redis Meetup
// F.Cerbelle <francois@redislabs.com>
//

var debug = require('debug')('iot:server');
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path')
//var viewRoute = require('./routes/view')
var viewRoute = require('./routes/index');
var subscriber = require("redis").createClient()
var client = require("redis").createClient()

//  , subscriber = redis.createClient(14658,"redis-14658.demo.francois.demo-rlec.redislabs.com")
//  , client = redis.createClient(14658,"redis-14658.demo.francois.demo-rlec.redislabs.com") ;

server.listen(3000);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',viewRoute);

// Socket.io setup
// Automatically push device list when the client connects
io.on("connection", function(socket) {
    debug("Connection");
    client.smembers("devices", function(err,devices) {
        devices.forEach(function(device){
                client.hgetall("r:"+device, function(err, detail) {
                    if (detail==null) {
                        detail=[];
                        detail['macaddr']=device;
                        detail['screenname']=device;
                    }
                    client.lrange("v:"+detail["macaddr"], 0, 0, function(err,value){
                        detail["values"] = value;
                        debug(detail);
                        socket.emit("update",detail);
                    });
                });
        });
    });
});

// Redis setup
// Automatically push device list updates and new values to the client
subscriber.on("message", function(channel, macaddr) {
    if (channel == "refreshvalues" ) {
        debug("refreshvalues");
        var detail = {};
        detail["macaddr"] = macaddr;
        client.lrange("v:"+detail["macaddr"], 0, 0, function(err,value){
            detail["values"] = value;
            debug(detail);
            io.sockets.emit("update",detail);
        });
    } else if (channel == "refreshdevices" ) {
        debug("refreshdevices");
        client.hgetall("r:"+macaddr, function(err, detail) {
            client.lrange("v:"+detail["macaddr"], 0, 0, function(err,value){
                detail["values"] = value;
                debug(detail);
                io.sockets.emit("update",detail);
            });
        });
    }
});

subscriber.subscribe("refreshvalues");
subscriber.subscribe("refreshdevices");

