import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import JSZip from 'jszip'
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

  // Download files as zip
  const downloadSeparateFiles = () => {
    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("script.js", js);
    zip.generateAsync({type:"blob"}).then((content) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(content);
      element.download = "codes.zip";
      document.body.appendChild(element); //firefox requires this
      element.click();
      document.body.removeChild(element);
    });
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
      <button className="btn" onClick={downloadFiles}>Download HTML</button>
      <button className="btn" onClick={downloadSeparateFiles}>Download Zip</button>
    </div>
  )
}

export default App;
