import { Box, Modal, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import Loader from '~/components/Loader'
import { API_URL } from '~/helpers/consts'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const Intro = ( ) => {
  const { update: {prevVersion, currVersion} } = Route.useLoaderData()
  const [ open, setOpen ] = useState( true )
  const handleClose = () => setOpen( false )

  return (
    <div className="intro">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Hello /presenter/intro/!
            <br />
            Updated from {prevVersion} to {currVersion}
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

type UpdatesType = {
  prevVersion: string,
  currVersion: string,
}

export const Route = createFileRoute( '/presenter/intro/' )( {
  component: Intro,
  pendingComponent: Loader,
  loader: async () => {
    const update = await fetch( `${API_URL}/update` ).then(
      ( res ) => res.json() as Promise<UpdatesType>
    )

    return { update }
  },
} )
