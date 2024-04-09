import "./index.scss"
import iconDownload from "../../static/download.svg"
import iconCopy from "../../static/copy.svg"
import { SERVER } from '../../api';

function handleDownload(data) {
  const a = document.createElement("a"); 
  a.download = data.content;
  a.href = SERVER + data.path;
  document.body.appendChild(a);
  a.click();
 }

 async function handleCopy(text) {

  try {
    await navigator.clipboard.writeText(text);
    alert('Text copied to clipboard');
  } catch (error) {
    console.error('Failed to copy: ', error);
  }
 }

export default function Material(material) {
const date = new Date(material.ctime);
const hours = date.getHours();
const munites = date.getMinutes();
const seconds = date.getSeconds();
return <div className={"material " + (material.dying ? "dying" : "")}>
        <div className='body'>
          <div className="time">{hours}:{munites}:{seconds}</div>
          <div className='content'>
            <span>{ material.type === 'file' && material.data.content }</span>
            <span>{ material.type === 'text' && material.data }</span>
          </div>
          <div className='size'>
          { material.type === 'file' && <span>size: { material.data.size }</span>}
          { material.type === 'text' && <span>size: { material.data.length }</span>}
          </div>
        </div>
        <div className='footer'>
          { material.type === 'file' &&  <img className='action' src={iconDownload} onClick={handleDownload.bind(null, material.data)}/>}
          { material.type === 'text' &&  <img className='action' src={iconCopy} onClick={handleCopy.bind(null, material.data)}/>}
        </div>
      </div>
}
