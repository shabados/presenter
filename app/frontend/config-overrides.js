// eslint-disable-next-line import/no-extraneous-dependencies
const rewireReactHotLoader = require( 'react-app-rewire-hot-loader' )

module.exports = ( oldConfig, env ) => ( {
  ...rewireReactHotLoader( oldConfig, env ),
  resolve: {
    ...oldConfig.resolve,
    alias: {
      ...oldConfig.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    },
  },
} )
