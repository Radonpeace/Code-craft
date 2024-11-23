import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import useLocalStorage from '../hooks/useLocalStorage'

function App() {
  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')

  // Download files with content as srcdoc in a single html file
  const downloadFiles = () => {
    const element = document.createElement('a');
    const file = new Blob([srcDoc], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element); //firefox requires this
    element.click();
    document.body.removeChild(element);
  }

  // Download files with content as separate files
  const downloadSeparateFiles = () => {
    const elementHtml = document.createElement('a');
    const fileHtml = new Blob([html], {type: 'text/html'});
    elementHtml.href = URL.createObjectURL(fileHtml);
    elementHtml.download = "index.html";
    document.body.appendChild(elementHtml); 
    elementHtml.click();

    const elementCss = document.createElement('a');
    const fileCss = new Blob([css], {type: 'text/css'});
    elementCss.href = URL.createObjectURL(fileCss);
    elementCss.download = "style.css";
    document.body.appendChild(elementCss); 
    elementCss.click();

    const elementJs = document.createElement('a');
    const fileJs = new Blob([js], {type: 'text/javascript'});
    elementJs.href = URL.createObjectURL(fileJs);
    elementJs.download = "script.js";
    document.body.appendChild(elementJs);
    elementJs.click();

    document.body.removeChild(elementHtml);
    document.body.removeChild(elementCss);
    document.body.removeChild(elementJs);
  }

  useEffect(() => {
    const timeout = setTimeout(() => { // here, both css, js file called into html, this will be passes as srcdoc
      setSrcDoc(`
        <html>     
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, 250)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  return (
    <div className='block'>
      <div className="pane top-pane">
        <Editor
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}

        />
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        />

      </div>
      <div className="pane">
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
      <button className="btn" onClick={downloadFiles}>Download All</button>
      <button className="btn" onClick={downloadSeparateFiles}>Download Files</button>
    </div>
  )
}

export default App;
