import * as config from './config';
import * as socketio from 'socket.io';
import * as os from 'os';

import * as hardware from './hardware';

import { OutgoingHttpHeaders } from 'node:http';

const io = socketio();

export default io;

export function handlePreflightRequest(req: any, res: any): void {
  const headers: OutgoingHttpHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Private-Network': 'true',
  };
  res.writeHead(200, headers);
  res.end();
};


var onDisconnectEvent: () => void = undefined;
var onDisconnectTimeout: NodeJS.Timeout = undefined;

io.on('connection', (socket) => {
  if (onDisconnectTimeout) {
    clearTimeout(onDisconnectTimeout);
    onDisconnectTimeout = undefined;
    onDisconnectEvent = undefined;
  }
  socket.on('disconnect', () => {
    onDisconnectTimeout = setTimeout(() => {
      onDisconnectTimeout = undefined;
      if (!Object.keys(io.sockets.sockets).length) {
        if (onDisconnectEvent) {
          onDisconnectEvent();
          onDisconnectEvent = undefined;
        }
      }
    }, 2000);
  });
  socket.on('setcustomhardware', (name: string, hardware: config.HardwareInfo) => {
    console.log('setting custom hardware', name, hardware);
    config.setCustomHardware(name, hardware);
  });

  socket.on('display/text', (text: { one: string, two: string }) => {
    hardware.loadDisplay().then((display) => {
      display.text(text);
      io.emit('display/text', text);
    }).catch((err) => {
      console.error('error on display/text', err);
      socket.emit('hardware/error', {
        origin: 'display/text',
        text,
        errorMessage: (err && err.message) || 'something bad happened'
      });
    });
  });

  socket.on('display/clear', () => {
    hardware.loadDisplay().then((display) => {
      display.clear();
      io.emit('display/clear');
    }).catch((err) => {
      console.error('error on display/clear', err);
      socket.emit('hardware/error', {
        origin: 'display/clear',
        errorMessage: (err && err.message) || 'something bad happened'
      });
    });
  });

  socket.on('display/text/onDisconnect', (text: { one: string, two: string }) => {
    console.log('setting onDisconnectEvent', text);
    io.emit('display/text/onDisconnect', text);
    onDisconnectEvent = () => {
      hardware.loadDisplay().then((display) => {
        display.text(text);
      }).catch((err) => {
        console.error('error on display/text', err);
      });
    };
  });

  socket.on('display/clear/onDisconnect', () => {
    console.log('setting onDisconnectEvent clear');
    io.emit('display/clear/onDisconnect');
    onDisconnectEvent = () => {
      hardware.loadDisplay().then((display) => {
        display.clear();
      }).catch((err) => {
        console.error('error on display/clear', err);
      });
    };
  });

  socket.on('networkInterfaces', () => {
    socket.emit('networkInterfaces', os.networkInterfaces());
  });
});
