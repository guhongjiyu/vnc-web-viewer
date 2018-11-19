const net = require('net');
const WebSocket = require('ws');
const { log } = require('./util/log.js');

class VNCWebSocketServer {

  constructor(port) {
    this.port = port;
    this.wss;
    this.tcpc;
    this.init();
  }

  init() {
    // 创建WebSocket服务器
    this.wss = this.createWebSocketServer(this.port);

    // WebSocket服务器 Event: connection
    this.wss.on('connection', (ws) => {
      if (!this.tcpc) {
        this.tcpc = this.createTCPClient(5900, '10.128.219.157');
        // 当TCP客户端收到数据时，便通过WebSocket服务器转发
        this.tcpc.on('data', (data) => {
          console.log('TCP client received:', data);
          log('TCP client received:', data);

          this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(Buffer.from(data));
            }
          });
        });
      }

      ws.on('message', (msg) => {
        console.log('message', msg);
        log('ws server received:', msg);
        this.tcpc.write(Buffer.from(msg));
      })
    });
  }

  createWebSocketServer(port) {
    const wss = new WebSocket.Server({
      port: this.port,
      verifyClient(info, cb) {
        // console.log(info.req.headers);
        cb(true);
      }
    });
    wss.on('error', (err) => {
      console.log('wss error: ', err);
    })
    return wss
  }

  createTCPClient(port, host="127.0.0.1") {
    // 创建TCP客户端
    const tcpClient = net.connect({ host, port }, function () {
      console.log('TCP connected on port: ', port);
    });
    tcpClient.on('error', function (err) {
      console.error('tcpClient error: ', err);
    });
    return tcpClient;
  }

}

module.exports = VNCWebSocketServer;