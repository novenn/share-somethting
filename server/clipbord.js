
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')

let LEFT_TIME = 1 * 60 * 1000;
const clipbord = [];
let timer = null

module.exports = {
  push(type, data) {
    const uuid = uuidv4();
    const content = {
      uuid: uuid,
      type: type,
      data: data,
      ctime: Date.now(),
      LEFT_TIME
    }
    clipbord.push(content);

    return content;
  },
  get() {
    return clipbord;
  },

  start(file_expired = 1) {
    LEFT_TIME = file_expired * 60 * 1000;
    setInterval(() => {
      const now = Date.now();
      for( let i = clipbord.length - 1; i >= 0; i-- ) {
        if(now >= clipbord[i].ctime + clipbord[i].LEFT_TIME) {
         
          if(clipbord[i].type === 'file') {
            fs.rmSync(path.join(__dirname, "./" + clipbord[i].data.path))
          }

          clipbord.splice(i, 1);
        }
      }
    }, 1000)
  },
  stop() {
    clearInterval(timer)
    timer = null
  }
}