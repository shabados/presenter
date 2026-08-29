import React, { useRef, useEffect } from 'react'

const Dialog = ( { open, onClose, className, children } ) => {
  const ref = useRef()

  useEffect( () => {
    const dialog = ref.current
    if ( !dialog ) return
    if ( open && !dialog.open ) dialog.showModal()
    else if ( !open && dialog.open ) dialog.close()
  }, [ open ] )

  const onBackdropClick = e => {
    if ( e.target === ref.current ) onClose?.()
  }

  return (
    <dialog ref={ref} className={className} onClick={onBackdropClick} onClose={onClose}>
      {children}
    </dialog>
  )
}

export default Dialog
