#!/usr/bin/env node
const express = require('express');
const http = require('http');
const io = require('./io');
const cors = require('cors');
const router = require("./router")
const path = require('path');
const fs = require('fs')
const { printAbout, printAvailables } = require('./utils');
const { program } = require('commander');
const chalk = require('chalk');

program
  .option('-p, --port <number>', 'specify the server port')
  .option('-e, --expires <number>', 'specify the file expiration in munites (default 10), after which the file that user shared will be removed');

program.parse();

const argv = program.opts();

const app = express();
const server = http.createServer(app);
const port = argv.port || 9527;

// base settings
app.use(express.json({limit: '10000mb',  extended: true,  charset: 'utf-8'}))
app.use(express.urlencoded({limit: '10000mb', extended: true, parameterLimit:50000, charset: 'utf-8'}))
app.use(cors());

// backend settings
app.use("/api", router)
app.use("/uploads/", express.static(path.join(__dirname,"./uploads"))); 

// frontend routes
app.use("*", (req, res) => {
  const filepath = path.join(__dirname, "../build" + req.baseUrl)
  if(fs.statSync(filepath).isFile()) {
    res.sendFile(filepath)
  } else {
    res.sendFile(path.join(__dirname,"../build/index.html"))
  }
})
 
const expires = argv.expires || 10
io.start(server, expires)

printAbout()

server.listen(port, () => {
  printAvailables(port)
  console.log(chalk.red(`    Note: Files shared by users will be deleted after ${expires} minutes`))
  console.log("Hit CTRL-C to stop the server")
});