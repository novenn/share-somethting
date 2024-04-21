const socketIO = require('socket.io');
const clipbord = require('./clipbord');

const clients = new Set();



module.exports = {
  start(server, file_expired = 1) {
    clipbord.start(file_expired);
    const io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
   
    io.on('connection', client => {
      client.send({
        type: 'content',
        data: clipbord.get()
      })

      
      client.on('disconnect', () => {
        clients.delete(client)
      });

      clients.add(client);
    });
  },
  push(type, data) {
    const piece = clipbord.push(type, data);
    clients.forEach(client => {
      client.send({
        type: 'content',
        data: [piece]
      })
    })
  }
}
