import React, { useState, useEffect } from 'react';
import './App.scss';
import io from 'socket.io-client';
import { PORT ,post, uploadFile } from './api';
import Material from './components/Material';
const LIFE_TIME = 0.35 * 60 * 1000;

const socket = io(window.location.hostname + ':' + PORT);

function App() {
  const [text, setText] = useState('');
  const [clipbord, setClipbord] = useState([]);

  useEffect(() => {
    function init() {
      console.log("的点点滴滴")
      // 监听服务器发送的消息
      socket.on('message', data => {
        if(data.type === 'text') {
          setClipbord([...data.data, ...clipbord])
        } else {
          setClipbord([...data.data, ...clipbord])
        }
      });
    }
    init()
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const materials = [...clipbord]
      let modified = false
      for (let i = materials.length - 1; i >= 0; i--) {
        const material = materials[i]
        const deadline = material.ctime + LIFE_TIME
        const remain = deadline - Date.now();
    
        if(remain < 0) {
          materials.splice(i, 1)
          modified = true;
        } else if(remain < 30 * 1000) {
          material["dying"] = true
          modified = true;
        } 
    
        console.log("remain", remain)
      }
    
      if(modified) {
        setClipbord([...materials])
      }

      console.log("remain", clipbord)

    }, 1000)

    return () => { clearInterval(timer) }
  }, [clipbord])



  const share = (type, data) => {
    // 在这里处理发送 textarea 内容的逻辑
    post("/api/push", {data, type})
  } 

  function pushClipbord() {
    return navigator.clipboard.readText()
       .then(function(text){
        share("text", text)
       })
       .catch(function(error){
         alert("无法读取剪切板")
       });
 }

 function handleKeyDown(event) {
  if(event.code === "KeyV" && (event.ctrlKey || event.metaKey)) {
    pushClipbord().then(text); 
  }
 }

 function handleChooseFile() {

 }

 function handleFileChange(event) {
  const file = event.target.files[0];
  uploadFile("/api/upload", file).then(data => {
    share("file", {
      ...data,
      content: data.fileName,
    })
  })
 }

  return (
    <div className="App">
      <div className="body">
        <div className="clipbord" tabIndex="-1" onKeyDown={handleKeyDown}>
          <div className='main'>
            { clipbord.map(i => Material(i))}
          </div>
        </div>
      </div>
      <div className="footer">
        <input type='file' className='file' onChange={handleFileChange}></input>
        <button className="share" onClick={handleChooseFile}>Choose File</button>
      </div>
    </div>
  );
}

export default App;