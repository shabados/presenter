import './Loader.css'

type LoaderProps = { 
  size?: string,
}

const Loader = ( { size: fontSize = '100px' }: LoaderProps) => (
  <div className="loader">
    <div className="lds-ring" style={{ fontSize }}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
)

export default Loader