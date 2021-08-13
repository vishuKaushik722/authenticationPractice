const express = require('express');
const app = express();
const http = require('http');
const mongoose = require("mongoose");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const userRoute = require("./routes/userRoute")
var cors = require('cors')

app.use(cors())
app.use(express.json())


const mongodbUrl = "mongodb+srv://socket:socket@cluster0.jr407.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useCreateIndex: true
}).catch(error => console.log(error.reason));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use("/api", userRoute);


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', (socket) => {
      console.log("DISCONNECTED");
  })
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});