import React from 'react'
import { Select, MenuItem, Typography, Grid } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './Dropdown.css'

const Dropdown = ( { name, icon, value, values, onChange } ) => (
  <Grid container className="dropdown">
    {icon ? <Grid item xs={1}> <FontAwesomeIcon icon={icon} /> </Grid> : null}
    <Grid item xs={5}><Typography className="label">{name}</Typography></Grid>
    <Grid item xs>
      <Select className="select" value={value} onChange={onChange}>
        {values.map( ( { name, value } ) =>
          <MenuItem key={value} value={value}>{name || value}</MenuItem> )}
      </Select>
    </Grid>
  </Grid>
)

export default Dropdown

