import * as config from './config';
import * as serialport from 'serialport';

export class Display {
  private port: serialport;
  private hardware?: config.HardwareInfo;

  constructor(port: serialport, hardware?: config.HardwareInfo) {
    this.port = port;
    this.hardware = hardware;

    console.log('display created', this.port, this.hardware);
  }

  public clear() {
    console.log('clearing screen');
    if (!this.port) {
      return;
    }
    // Hex 1B f U sets UK character set
    if (this.hardware?.custOptions?.setCharacterSet) {
      this.port.write(String.fromCharCode(parseInt("0x1B")) + 'fU');
    }
    this.port.write(String.fromCharCode(parseInt("0x0C")));
  }

  public lineOne(text: string) {
    console.log('setting line 1 to:', text, this.hardware?.custOptions);
    if (!this.port) {
      return;
    }
    text = text.toString().substr(0, 20).padEnd(20, ' ');
    // Hex 1B 51 41 then up to 20 characters then Hex 0D - write to top line
    let lineOne = String.fromCharCode(parseInt("0x1B")) + String.fromCharCode(parseInt("0x51")) + text + String.fromCharCode(parseInt("0x0D"));
    if (this.hardware?.custOptions?.lineOnePrefix) {
      lineOne = String.fromCharCode(parseInt("0x1B")) + String.fromCharCode(parseInt("0x51")) + String.fromCharCode(parseInt("0x41")) + text + String.fromCharCode(parseInt("0x0D"));
    }
    // Hex 1B f U sets UK character set
    if (this.hardware?.custOptions?.setCharacterSet) {
      this.port.write(String.fromCharCode(parseInt("0x1B")) + 'fU');
    }
    this.port.write(lineOne);
    // this.port.write(String.fromCharCode(parseInt("0x1B")) + 'fU');
  }

  public lineTwo(text: string) {
    console.log('setting line 2 to:', text, this.hardware?.custOptions);
    if (!this.port) {
      return;
    }
    text = text.toString().substr(0, 20).padEnd(20, ' ');
    // Hex 1B 51 42 then up to 20 characters then Hex 0D - write to bottom line
    let lineTwo = String.fromCharCode(parseInt("0x1B")) + String.fromCharCode(parseInt("0x51")) + text + String.fromCharCode(parseInt("0x0D"));
    if (this.hardware?.custOptions?.lineTwoPrefix) {
      lineTwo = String.fromCharCode(parseInt("0x1B")) + String.fromCharCode(parseInt("0x51")) + String.fromCharCode(parseInt("0x42")) + text + String.fromCharCode(parseInt("0x0D"));
    }
    // Hex 1B f U sets UK character set
    if (this.hardware?.custOptions?.setCharacterSet) {
      this.port.write(String.fromCharCode(parseInt("0x1B")) + 'fU');
    }
    this.port.write(lineTwo);
    // this.port.write(String.fromCharCode(parseInt("0x1B")) + 'fU');
  }

  public text(text: { one: string, two: string }) {
    this.lineOne(text.one);
    this.lineTwo(text.two);
  }

  public close() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  }

}
