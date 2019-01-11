'use strict';

const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
});

// Numbers Namespace, Letters Namespace
const numbers = io.of('/numbers');
const letters = io.of('/letters');

// Listeners for Numbers connections
numbers.on('connection', (socket) => {
  console.log('Connected to numbers', socket.id);

  // connect to room inside of numbers
  socket.on('join', (room) => {
    socket.join(room);
  });

  // emmit positive to all in Numbers namespace
  let i = 0;
  socket.on('next-number', () => {
    socket.broadcast.emit('number', i);
   
    // emmit negative for negative room
    socket.in('negative').emit('_number', (-i));
    i++;
  });
});

// Listeners for Letters connections
letters.on('connection', (socket) => { 
  console.log('Connected to letters', socket.id);

  //connect to room inside of letters
  socket.on('join', (room) => {
    socket.join(room);
  });

  // emmit letter
  let i = 65;
  socket.on('next-letter', () => {
    socket.broadcast.emit('letter', String.fromCharCode(i));
    // emmit lower case
    let j = i + 32;
    socket.in('lowercase').emit('_letter', String.fromCharCode(j));
    i++;
    if (i > 90) {
      i = 65;
    }
  });
});



