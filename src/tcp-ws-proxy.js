const net = require('net');
const WebSocket = require('ws');
const fs = require('fs');
const { logFile: log } = require('./util/log.js');


// 创建WebSocket服务器
const wsServer = new WebSocket.Server({ port: 22000 });
let tcpClient;

wsServer.on('connection', function connection(ws) {

  // 创建TCP客户端
  tcpClient = net.connect({ port: 5900 }, function () {
    console.log('TCP连接已建立');
  });
  // 当TCP客户端收到数据时，便通过WebSocket服务器转发
  tcpClient.on('data', function (data) {
    console.log('TCP client received:', data);
    log('TCP client received:', data);

    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(Buffer.from(data));
      }
    });
  });
  tcpClient.on('error', function (err) {
    console.error('Error: ', err);
    console.log('tcpClient.destroyed', tcpClient.destroyed);
  })

  // 当WebSocket服务器收到数据时，便通过TCP客户端转发
  ws.on('message', function incoming(message) {
    console.log('wsServer received:', message);
    log('ws server received:', message);

    tcpClient.write(Buffer.from(message));
  });
  // ws.send('something');
});