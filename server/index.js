const express = require('express');
const http = require('http');
const io = require('./io');
const cors = require('cors');
const router = require("./router")
const path = require('path');
const fs = require('fs')

const app = express();
const server = http.createServer(app);

// 启动服务器
const port = 9527;

app.use(express.json({limit: '10000mb',  extended: true,  charset: 'utf-8'}))
app.use(express.urlencoded({limit: '10000mb', extended: true, parameterLimit:50000, charset: 'utf-8'}))
app.use(cors());
app.use("/api", router)
app.use("/uploads/", express.static(path.join(__dirname,"./uploads"))); 
app.use("*", (req, res) => {
  const filepath = path.join(__dirname, "../build" + req.baseUrl)
  
  if(fs.statSync(filepath).isFile()) {
    res.sendFile(filepath)
  } else {
    res.sendFile(path.join(__dirname,"../build/index.html"))
  }
})

io.start(server)

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});