import React from 'react'
import { Select, MenuItem, Typography } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const Dropdown = ( { name, icon, value, values, onChange } ) => (
  <div className="dropdown">
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
    <Typography>{name}</Typography>
    <Select value={value.value} onChange={onChange}>
      {values.map( ( { name, value } ) => <MenuItem key={value} value={value}>{name}</MenuItem> )}
    </Select>
  </div>
)

export default Dropdown

