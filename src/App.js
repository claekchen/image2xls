import React, { Component } from 'react'
// import logo from './logo.svg';
import './App.css'
const remote = window.require('electron').remote
const ipcRenderer = window.require('electron').ipcRenderer
ipcRenderer.on('fileSuccess', (evt, arg) => {
  window.alert('成功')
})
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: '',
      id: ''
    }
  }
  onClick () {
    let filePath
    console.log(filePath = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))
    ipcRenderer.send('filePath', filePath)
  }
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>OCR</h1>
          <button onClick={this.onClick}>表格识别</button>
        </header>
      </div>
    )
  }
}

export default App
