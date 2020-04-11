import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { makeStyles, Typography, Popover, IconButton } from '@material-ui/core'

let isOpen = false

const useStyles = makeStyles( theme => ( {
  typography: {
    padding: theme.spacing( 1.5 ),
  },
} ) )

export default function ShabadInfo() {
  const classes = useStyles()
  const [ anchorEl, setAnchorEl ] = React.useState( null )

  const handleClick = event => {
    isOpen = true
    setAnchorEl( event.currentTarget )
  }

  const handleClose = () => {
    isOpen = false
    setAnchorEl( null )
  }

  const checkState = () => {
    if ( isOpen ) { return faTimesCircle }
    return faInfoCircle
  }
  const open = Boolean( anchorEl )
  const id = open ? 'simple-popover' : undefined

  return (
    <span>
      <IconButton
        variant="contained"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={checkState()} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >

        <Typography className={classes.typography}>
            Raag:

          <br />
            Author:

          <br />
            Page:

          <br />
            Source:

          <br />
          Copy Shabad

          <br />
          Open in DB Viewer to report correction
        </Typography>

      </Popover>
    </span>
  )
}
