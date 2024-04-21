var chalk =  require("chalk");
var figlet = require("figlet");

function getIps() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
          if (net.family === familyV4Value && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results.push(net.address);
          }
      }
  }

  return results;
}

function printAbout() {
 
  var name = "Share Something"
  try {
    var text = figlet.textSync(name)
    console.log(chalk.magenta(text))
  } catch (e) {
    console.log(chalk.magenta(name))
  }
}

function printAvailables(port) { 

  const ips = getIps()
  console.log('');
  console.log('Available on:');

  ['127.0.0.1', ...ips].forEach(ip => {
    console.log(chalk.green(`    http://${ip}:${port}`))
  })

  
}
module.exports = {
  printAbout,
  printAvailables
}