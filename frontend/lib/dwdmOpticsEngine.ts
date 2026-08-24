/**
 * NetVision Optical DWDM & 800G Coherent Transmission Engine (Version 6.6)
 * Simulates ITU-T C-Band DWDM Wavelengths, Reconfigurable Optical Add-Drop Multiplexers (ROADM),
 * EDFA Amplifiers, and Optical Signal-to-Noise Ratio (OSNR) physics.
 */

export interface OpticalLambdaChannel {
  channelNumber: number;
  frequencyThz: number;
  wavelengthNm: number;
  modulation: '800G_DP_64QAM' | '400G_DP_16QAM' | '100G_DP_QPSK';
  osnrDb: number;
  berStatus: 'ERROR_FREE' | 'CORRECTABLE_FEC' | 'UNRECOVERABLE_ERRORS';
  roadmAction: 'EXPRESS_THROUGH' | 'ADD_DROP_LOCAL';
}

export class DwdmOpticsEngine {
  public static getInitialChannels(): OpticalLambdaChannel[] {
    return [
      { channelNumber: 1, frequencyThz: 193.1, wavelengthNm: 1552.52, modulation: '800G_DP_64QAM', osnrDb: 28.4, berStatus: 'ERROR_FREE', roadmAction: 'EXPRESS_THROUGH' },
      { channelNumber: 2, frequencyThz: 193.2, wavelengthNm: 1551.72, modulation: '800G_DP_64QAM', osnrDb: 27.9, berStatus: 'ERROR_FREE', roadmAction: 'EXPRESS_THROUGH' },
      { channelNumber: 3, frequencyThz: 193.3, wavelengthNm: 1550.92, modulation: '400G_DP_16QAM', osnrDb: 22.1, berStatus: 'CORRECTABLE_FEC', roadmAction: 'ADD_DROP_LOCAL' },
      { channelNumber: 4, frequencyThz: 193.4, wavelengthNm: 1550.12, modulation: '800G_DP_64QAM', osnrDb: 28.1, berStatus: 'ERROR_FREE', roadmAction: 'EXPRESS_THROUGH' },
    ];
  }
}
