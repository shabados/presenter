import React, { Component } from 'react'

import Reboot from 'material-ui/Reboot'

import Navigator from './components/Navigator'

import './App.css'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Reboot />
        <Navigator></Navigator>
      </div>
    )
  }
}

export default App
