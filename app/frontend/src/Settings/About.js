import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'

import Loader from '../shared/Loader'
import { BACKEND_URL, BACKEND_PORT, isElectron } from '../lib/consts'
import controller from '../lib/controller'

import CopyButton from './CopyButton'
import { Button } from '../components/form'

const aboutFields = [
  [ 'version', 'Shabad OS Version' ],
  [ 'databaseVersion', 'Shabad OS Database Version' ],
  [ 'hostname', 'Shabad OS Host' ],
  [ 'platform', 'Platform' ],
  [ 'release', 'Release' ],
  [ 'arch', 'Architecture' ],
  [ 'cpus', 'CPU(s)' ],
]

const About = ( { connected } ) => {
  const [ about, setAbout ] = useState( null )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( res => res.json() )
      .then( setAbout )
  }, [] )

  if ( !about ) return <Loader />

  return (
    <ul className="about">
      <li>
        <div className="about-row">
          <span className="about-label">Server Address</span>
          <span>
            {Object.entries( about.addresses ).map( ( [ name, address ] ) => (
              <CopyButton key={name} copyText={`http://${address}:${BACKEND_PORT}`}>{`${address}:${BACKEND_PORT} (${name})`}</CopyButton>
            ) )}
          </span>
        </div>
      </li>

      {aboutFields.map( ( [ key, name ] ) => (
        <li key={key}>
          <div className="about-row">
            <span className="about-label">{name}</span>
            <span>{about[ key ]}</span>
          </div>
        </li>
      ) )}

      <li>
        <div className="about-row">
          <span className="about-label">Connected Devices</span>
          <span>{connected}</span>
        </div>
      </li>

      <li>
        <div className="about-row about-center">
          <Button className="folder-button" disabled={!isElectron} onClick={() => controller.action( 'open-logs-folder' )}>Open Logs Folder</Button>
        </div>
      </li>

    </ul>
  )
}

About.propTypes = {
  connected: number.isRequired,
}

export default About
