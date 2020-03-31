const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

var config = {
      "USER"     : "onmistack10", 
      "PASS"     : "onmistack10",
      "DATABASE" : "tin-dev",
      "CLUSTER"  : "<CLUSTER_MONGO>"
};

var dbUrl = "mongodb+srv://"
    + config.USER
    + ":"
    + config.PASS
    + config.CLUSTER
    + config.DATABASE
    +"?retryWrites=true&w=majority";

mongoose.connect(
    dbUrl, 
    {
        useNewUrlParser: true
    }
);

// connection failed event handler
mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server! " + err);
});

mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});


app.use((request, response, next) => {
    request.io = io;
    request.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
