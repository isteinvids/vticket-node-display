import * as serialport from 'serialport';

export class Trigger {
  private port: serialport;

  constructor(port: serialport) {
    this.port = port;
  }

  public openDrawer(char: string = '0x0D') {
    console.log('opening drawer with char', char);
    if (!this.port) {
      return;
    }
    this.port.write(String.fromCharCode(parseInt(char)));
  }

}
