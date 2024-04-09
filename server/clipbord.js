
const { v4: uuidv4 } = require('uuid');

const LIFE_TIME = 5 * 60 * 1000;
const clipbord = [];
let timer = null
let expiredCallback = () => null

module.exports = {
  push(type, data) {
    const uuid = uuidv4();
    const content = {
      uuid: uuid,
      type: type,
      data: data,
      ctime: Date.now(),
    }
    clipbord.push(content);

    return content;
  },
  get() {
    return clipbord;
  },

  onexpired(callback) {
    expiredCallback = callback;
  },
  start() {
    timer = setInterval(() => {
      const last = clipbord[clipbord.length - 1];
      if(last && Date.now() - last.ctime > LIFE_TIME) { 
        expiredCallback(last);
        clipbord.shift()
      }
    }, 3000)
  },
  stop() {
    clearInterval(timer)
    timer = null
  }
}