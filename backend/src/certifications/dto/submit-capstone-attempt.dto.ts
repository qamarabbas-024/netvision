import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class SubmitCapstoneAttemptDto {
  @ApiPropertyOptional({
    example: { 'THEORY-Q1': 2, 'THEORY-Q2': 0 },
    description: 'Record of theory question IDs to candidate selected option index (0..3)',
  })
  @IsOptional()
  @IsObject()
  theoryAnswers?: Record<string, number | string>;

  @ApiPropertyOptional({
    example: {
      layerDomain: 'LAYER_2_DATA_LINK',
      protocolFailure: 'SWITCHING_LOOP_BPDU_FILTER',
      rootCause: 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER',
      diagnosticOrder: ['CMD_SYSLOG', 'CMD_MAC_TABLE', 'CMD_CDP_NEIGHBOR', 'CMD_INTERFACE_CONFIG'],
      remediationChoice: 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD',
    },
    description: 'Structured candidate responses for the enterprise multi-layer topology incident challenge',
  })
  @IsOptional()
  @IsObject()
  incidentAnswers?: Record<string, any>;

  @ApiPropertyOptional({
    example: { 'FORENSICS-Q1': 0, 'FORENSICS-Q2': 0, 'FORENSICS-Q3': 1, 'FORENSICS-Q4': 0 },
    description: 'Record of packet capture forensic question IDs to candidate answers',
  })
  @IsOptional()
  @IsObject()
  forensicsAnswers?: Record<string, number | string>;
}
