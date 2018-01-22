import React, { Component } from 'react'

import 'typeface-noto-sans'
import Reboot from 'material-ui/Reboot'

import Navigator from './components/Navigator'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      settings: null,
      session: null,
    }
  }

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
