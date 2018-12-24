import React from 'react'
import { Switch, Typography } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './Toggle.css'

const Toggle = ( { name, icon, value, onChange } ) => (
  <div className="toggle">
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
    <Typography className="label">{name}</Typography>
    <Switch checked={value} onChange={onChange} />
  </div>
)

export default Toggle

