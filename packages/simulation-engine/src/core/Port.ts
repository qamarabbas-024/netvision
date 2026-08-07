export class Port {
  public id: string;
  public name: string;
  public macAddress: string;
  public ipAddress: string;
  public subnetMask: string;
  public isConnected: boolean;

  constructor(
    id: string,
    name: string,
    macAddress: string,
    ipAddress: string = '0.0.0.0',
    subnetMask: string = '255.255.255.0'
  ) {
    this.id = id;
    this.name = name;
    this.macAddress = macAddress;
    this.ipAddress = ipAddress;
    this.subnetMask = subnetMask;
    this.isConnected = false;
  }
}
