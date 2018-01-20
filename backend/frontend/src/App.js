import React, { Component } from 'react'

import 'typeface-noto-sans'

import Reboot from 'material-ui/Reboot'

import Navigator from './components/Navigator'

import './App.css'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Reboot />
        <Navigator></Navigator>
        <div>WHY the shaadow</div>
      </div>
    )
  }
}

export default App
