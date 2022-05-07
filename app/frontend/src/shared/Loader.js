import './Loader.css'

import { string } from 'prop-types'

const Loader = ( { size: fontSize } ) => (
  <div className="loader">
    <div className="lds-ring" style={{ fontSize }}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
)

Loader.propTypes = {
  size: string,
}

Loader.defaultProps = {
  size: '100px',
}

export default Loader
