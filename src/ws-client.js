const WebSocket = require('ws');
const DES = require('./des.js');
 
const ws = new WebSocket('ws://127.0.0.1:22000');

let count = 0;
 
ws.on('open', function open() {
  // ws.send('something');
  const handshakeMessage = 'RFB 003.003\n';
  ws.send(Buffer.from(handshakeMessage));
});
 
ws.on('message', function incoming(data) {
  count++;
  console.log(data);

  if (count === 1) {
    const handshakeMessage = 'RFB 003.003\n';
    ws.send(Buffer.from(handshakeMessage));
  }
  if (count === 2) {
    const d = new Uint8Array(data, 0, 16);
    const passwd = '123456'.split('').map(item => item.charCodeAt());
    
    console.log('------------------------------------');
    console.log(passwd);
    console.log('------------------------------------');
    const e = (new DES(passwd)).encrypt(Array.from(d));

    console.log(Buffer.from(e), ':after');
    ws.send(Buffer.from(e));
  }
});
