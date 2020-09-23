const express = require('express');
const path = require('path');
const ws = require('ws');
const app = express();
app.use(express.json());

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

let messages = [];
app.post('/api/messages', (req, res, next)=> {
  const message = {...req.body, id: Math.random()};
  messages.push(message);
  res.send(message);
});

app.get('/api/messages', (req, res, next)=> {
  res.send(messages);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, ()=> console.log(`listening on port ${port}`));

const socketServer = new ws.Server({ server });

let sockets = [];
socketServer.on('connection', (socket)=> {
  sockets.push(socket);
  socket.send('Welcome socket');
  console.log('socket connected');
  socket.on('message', (evt)=> {
    console.log(sockets.length);
    sockets.forEach( s => s.send(evt));
  });
  socket.on('close', ()=> {
    sockets = sockets.filter(s => s !== socket);
  });
});
