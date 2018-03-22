import React, { Component } from 'react'

import Reboot from 'material-ui/Reboot'

import Navigator from './components/Navigator'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      settings: null,
      session: null,
      theme: 'Night',
    }
  }

  render() {
    const { theme } = this.state

    return (
      <div className={`app theme-${theme.toLowerCase()}`}>
        <Reboot />
        <Navigator></Navigator>
      </div>
    )
  }
}

export default App
