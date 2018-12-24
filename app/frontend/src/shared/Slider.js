import React from 'react'
import { Slider } from '@material-ui/lab'
import { Typography } from '@material-ui/core'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './Slider.css'

export default ( { name, icon, value, onChange } ) => (
  <div className="slider">
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
    <Typography className="label">{name}</Typography>
    <Slider value={value} onChange={onChange} />
  </div>
)
