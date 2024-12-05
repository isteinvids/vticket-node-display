// require modules
import * as config from './config';
import * as serialport from 'serialport';

import { Display } from './display';
import { Trigger } from './trigger';

const portInfos: { [port: string]: serialport } = {};

export const listHardwares = () => {
  return serialport.list().then((portsList) => {
    return portsList;
  });
}

export const loadHardwarePort = (hardware: config.HardwareInfo): Promise<serialport> => {
  const theKey = hardware.vendorID || hardware.path;

  if (hardware && portInfos[theKey] && portInfos[theKey].isOpen) {
    return Promise.resolve(portInfos[theKey]);
  }

  return serialport.list().then((allPortsList) => {
    let portInfo: serialport.PortInfo;

    allPortsList.forEach(function (port: serialport.PortInfo) {
      if (port.vendorId && port.vendorId.toString() === hardware.vendorID) {
        portInfo = port;
      }
      if (port.path && port.path.toString() === hardware.path) {
        portInfo = port;
      }
    });

    // if not found, display error and quit
    if (!portInfo) {
      console.error('ERROR: Display - port ,', (hardware?.vendorID || hardware?.path), 'not found');
      throw new Error('port not found (' + (hardware?.vendorID || hardware?.path) + ')');
    }

    // connect to display
    portInfos[theKey] = new serialport(portInfo.path, hardware.options || {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none'
    }, (err) => {
      // shouldn't ever happen because serialport.list has already
      // given us a path that should work
      if (err) {
        return console.error('ERROR: Display - ' + err.message)
      }
    });
    portInfos[theKey].on('close', () => {
      console.log('closed port...');
      delete portInfos[theKey];
    });
    return portInfos[theKey];
  });
}

export const loadDisplay = (): Promise<Display> => {
  const hardware: config.HardwareInfo = config.getCustomHardware('display') || config.display;
  console.log('loading display, hardware is', hardware);
  return loadHardwarePort(hardware).then((port: serialport) => {
    console.log('loaded port! hardware is', hardware);
    return new Display(port, hardware);
  }).catch((err) => {
    if (process.env.NODE_ENV === 'dev') {
      return new Display(undefined, hardware);
    }
    throw err;
  });
}

export const loadTrigger = (): Promise<Trigger> => {
  const hardware: config.HardwareInfo = config.getCustomHardware('trigger') || config.trigger;
  return loadHardwarePort(hardware).then((port: serialport) => {
    return new Trigger(port);
  }).catch((err) => {
    if (process.env.NODE_ENV === 'dev') {
      return new Trigger(undefined);
    }
    throw err;
  });
}
