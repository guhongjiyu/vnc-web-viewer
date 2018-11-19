const fs = require('fs');

function fileLog(flag, data) {
  const logFile = 'log.txt';

  const dataBuffer = Buffer.from(data);
  const dataUint8Array = new Uint8Array(dataBuffer);
  const dataString = dataUint8Array.map((item) => {
    return item.toString();
  }).join(' ');
  const dataLog = `Buffer <${dataString}>`;

  fs.writeFileSync(logFile, '\n---' + flag + ':\n', {flag:'a'});
  fs.writeFileSync(logFile, dataLog, {flag:'a'});
  fs.writeFileSync(logFile, '\n---\n', {flag:'a'});
}

module.exports = {
  log: fileLog
};