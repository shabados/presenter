import dnssd from 'dnssd'

import { PORT } from './consts'

const shabadOSAd = new dnssd.Advertisement( dnssd.tcp( 'ShabadOS' ), PORT )
shabadOSAd.start()

const devices = []

// A resolved service looks like:

// service = {
//   fullname: 'InstanceName._googlecast._tcp.local.',
//   name: 'InstanceName',
//   type: { name: 'googlecast', protocol: 'tcp' },
//   domain: 'local',
//   host: 'Hostname.local.',
//   port: 8009,
//   addresses: ['192.168.1.15'],
//   txt: { id: 'strings' },
//   txtRaw: { id: <Buffer XX XX XX... >},
// };

const browser = dnssd.Browser( dnssd.tcp( 'ShabadOS' ) )
  .on( 'serviceUp', service => {
    console.log( 'Device up: ', service )
    devices.push( service.name )
  } )
  .on( 'serviceDown', service => {
    console.log( 'Device down: ', service )
    // TODO: Remove the device from the array when disconnected
  } )
  .start()


export default devices
