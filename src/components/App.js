import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import useLocalStorage from '../hooks/useLocalStorage'

function App() {
  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')

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
    <>
      <div className="pane top-pane">
        <Editor
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}

        />
        <button onClick={() => {navigator.clipboard.writeText(html)}} >Copy</button>
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <button onClick={() => {navigator.clipboard.writeText(css)}} >Copy</button>
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        />
        <button onClick={() => {navigator.clipboard.writeText(js)}} >Copy</button>
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
    </>
  )
}

export default App;
