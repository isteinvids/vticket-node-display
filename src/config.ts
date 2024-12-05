import * as serialport from 'serialport';

const customHardwares: { [name: string]: HardwareInfo } = {};

export interface HardwareInfo {
    path?: string;
    vendorID?: string;
    options: serialport.OpenOptions;
    custOptions?: { [key: string]: string };
}

// set COM port parameters
// productID and vendorID can be found in Windows Device Manager and are used to identify hardware
// for most devices the default 9600, none, 8, 1 values should be fine

// Partner Technology Inc CD-7220 pole display
export const display: HardwareInfo = {
    vendorID: process.env.DISPLAY_VENDOR_ID,
    options: {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    }
};

// DT-100U cash drawer trigger
export const trigger: HardwareInfo = {
    vendorID: process.env.TRIGGER_VENDOR_ID,
    options: {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    }
};

export const getCustomHardware = (name: string): HardwareInfo => {
    return customHardwares[name];
}

// function to set custom display settings
export const setCustomHardware = (name: string, hardware: HardwareInfo) => {
    customHardwares[name] = hardware;
}