export declare class Port {
    id: string;
    name: string;
    macAddress: string;
    ipAddress: string;
    subnetMask: string;
    isConnected: boolean;
    constructor(id: string, name: string, macAddress: string, ipAddress?: string, subnetMask?: string);
}
