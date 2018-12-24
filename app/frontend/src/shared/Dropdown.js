import React from 'react'
import { Select, MenuItem, Typography } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './Dropdown.css'

const Dropdown = ( { name, icon, value, values, onChange } ) => (
  <div className="dropdown">
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
    <Typography className="label">{name}</Typography>
    <Select className="select" value={value} onChange={onChange}>
      {values.map( ( { name, value } ) => <MenuItem key={value} value={value}>{name || value}</MenuItem> )}
    </Select>
  </div>
)

export default Dropdown

