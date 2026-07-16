import React, { useContext, useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { toUnicode, stripVishraams } from 'gurmukhi-utils'

import { ContentContext, WritersContext, RecommendedSourcesContext } from '../../lib/contexts'
import { useCurrentLine, useCurrentLines, useCopyToClipboard } from '../../lib/hooks'
import controller from '../../lib/controller'

import './ShabadInfo.css'

const getDbViewerUrl = lineId => `https://viewer.shabados.com/line/${lineId}`

const ShabadInfo = () => {
  const iconButtonRef = useRef()
  const popoverRef = useRef()

  const [ isPopoverOpen, setPopoverOpen ] = useState( false )

  const { shabad, bani } = useContext( ContentContext )
  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  const [ line ] = useCurrentLine()
  const lines = useCurrentLines()

  const onClick = () => setPopoverOpen( true )
  const onClose = () => setPopoverOpen( false )

  const copyToClipboard = useCopyToClipboard()

  useEffect( () => {
    if ( !isPopoverOpen ) return undefined

    const handler = e => {
      if (
        popoverRef.current
        && !popoverRef.current.contains( e.target )
        && e.target !== iconButtonRef.current
        && !iconButtonRef.current?.contains( e.target )
      ) {
        onClose()
      }
    }

    document.addEventListener( 'mousedown', handler )
    return () => document.removeEventListener( 'mousedown', handler )
  }, [ isPopoverOpen ] )

  const barIcon = isPopoverOpen ? faTimesCircle : faInfoCircle

  const { sourceId, writerId, section } = shabad || line.shabad
  const { nameEnglish: sectionName } = bani || section
  const { id: lineId, sourcePage } = line

  const { nameEnglish: writerName } = writers[ writerId ]
  const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]

  const onCopyClick = () => {
    const gurmukhi = lines.map( ( { gurmukhi } ) => gurmukhi ).join( ' ' )

    copyToClipboard( stripVishraams( toUnicode( gurmukhi ) ) )
  }

  const openViewer = () => controller.openExternalUrl( getDbViewerUrl( lineId ) )

  return (
    <span className="shabad-info">

      <button ref={iconButtonRef} type="button" className="info-button" onClick={onClick}>
        <FontAwesomeIcon icon={barIcon} />
      </button>

      {isPopoverOpen && (
        <div ref={popoverRef} className="popover">
          <div className="popover-box-text">

            <span className="source-name">{sourceName}</span>
            <span>, </span>
            <span className="page-name">{pageName}</span>
            <span> </span>
            <span className="source-page">{sourcePage}</span>
            <br />
            <span className="section-name">{sectionName}</span>
            <br />
            <span className="writer-name">{writerName}</span>
            <br />

            <div className="popover-buttons">

              <button
                type="button"
                className="db-viewer button"
                title="Report a mistake"
                onClick={openViewer}
              >
                Open Online
              </button>

              <button
                type="button"
                className="copy-shabad button"
                title="Click to copy this shabad"
                disabled={!shabad}
                onClick={onCopyClick}
              >
                Copy
              </button>

            </div>

          </div>
        </div>
      )}

    </span>
  )
}

export default ShabadInfo
