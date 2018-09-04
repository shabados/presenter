import React, { Component } from 'react'

import { IconButton, Select, MenuItem } from 'material-ui'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faArrowsAltV } from '@fortawesome/fontawesome-free-solid'

import './Settings.css'

const DropdownOption = ( { icon, options, onChange } ) => (
  <div className="dropdown option">
    <IconButton>
      <FontAwesomeIcon size="lg" icon={icon} />
    </IconButton>
    <Select value="o" onChange={onChange}>
      {options.map( ( { name, value } ) => <MenuItem key={value} value={value}>{name}</MenuItem> )}
    </Select>
  </div>
)

const SliderOption = ( { icon, onChange } ) => (
  <div className="slider option">
    <IconButton>
      <FontAwesomeIcon size="lg" icon={icon} />
    </IconButton>
  </div>
)

const ToggleOption = ( { icon, onChange } ) => (
  <div className="toggle option">
    <IconButton>
      <FontAwesomeIcon size="lg" icon={icon} />
    </IconButton>
  </div>
)

class Settings extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      spacing: 'Space Around',
    }
  }

  render() {
    return (
      <div className="settings">
        <h1>Layout</h1>
        <DropdownOption
          icon={faArrowsAltV}
          options={[
            { name: 'Space Around', value: 'eee' },
             ]}
          onChange={c => console.log( c )}
        />
        <hr />
      </div>
    )
  }
}

export default Settings
