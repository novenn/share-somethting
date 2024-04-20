const socketIO = require('socket.io');
const clipbord = require('./clipbord');


const clients = new Set();

clipbord.start();

module.exports = {
  start(server) {
    const io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    // 声明和绑定Socket.IO事件
    io.on('connection', client => {
      client.send({
        type: 'content',
        data: clipbord.get()
      })

      // 监听客户端断开连接
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
