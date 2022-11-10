import { WebSocket } from 'ws'

const client = new WebSocket('ws://localhost:42425')

client.on('message', m => console.log(JSON.parse(m)))
