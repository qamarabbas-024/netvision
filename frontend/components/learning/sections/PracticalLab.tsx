'use client';

import React from 'react';
import { PracticalLabEngine } from '../labs/PracticalLabEngine';
import { GuidedPracticeTerminal } from '../blocks/GuidedPracticeTerminal';
import { BreakFixScenarioCard } from '../blocks/BreakFixScenarioCard';
import { LessonLabItem } from '@/types/learning';

export interface PracticalLabProps {
  topicSlug: string;
  labs?: LessonLabItem[];
}

export const PracticalLab: React.FC<PracticalLabProps> = ({ topicSlug, labs }) => {
  const primaryLab = labs && labs.length > 0 ? labs[0] : null;

  if (primaryLab) {
    return (
      <PracticalLabEngine
        lab={{
          id: primaryLab.id,
          title: primaryLab.title || 'Practical Networking Lab',
          type: primaryLab.type || 'GUIDED',
          difficulty: 'Intermediate',
          estimatedMinutes: 15,
          objectives: ['Execute CLI diagnostic commands', 'Verify socket ICMP / IP telemetry observations'],
          instructions: primaryLab.instructions || 'Execute network diagnostic commands in the socket CLI simulator below.',
          commands: ['ping 192.168.1.1', 'arp -a', 'nslookup netvision.edu', 'ipconfig /all'],
          expectedObservations: ['IPv4 Address', 'Default Gateway IP', 'ICMP Echo Reply'],
          hints: [
            'Hint 1: Check your local gateway IP using ipconfig /all.',
            'Hint 2: Verify ICMP ping responses from 192.168.1.1.',
          ],
        }}
      />
    );
  }

  const guidedLab = labs?.find((l) => l.type === 'GUIDED');
  const challengeLab = labs?.find((l) => l.type === 'CHALLENGE');

  return (
    <div className="flex flex-col gap-6">
      <GuidedPracticeTerminal
        topicSlug={topicSlug}
        instructions={guidedLab?.instructions || 'Execute network diagnostic commands in the socket CLI simulator below.'}
      />

      <BreakFixScenarioCard
        topicSlug={topicSlug}
        scenario={
          challengeLab
            ? {
                id: challengeLab.id,
                title: challengeLab.title,
                symptom: challengeLab.instructions,
                topologySummary: 'Virtual Topology Node Host ➔ Gateway Router',
                options: [
                  {
                    id: 'opt-fix-1',
                    label: 'Correct Misconfigured Gateway IP / Subnet Mask',
                    isCorrectFix: true,
                    explanation: 'Restored gateway mapping and Layer 3 packet routing.',
                  },
                  {
                    id: 'opt-fix-2',
                    label: 'Restart local computer',
                    isCorrectFix: false,
                    explanation: 'Restarting does not fix permanent subnet mask misconfigurations.',
                  },
                ],
              }
            : undefined
        }
      />
    </div>
  );
};
