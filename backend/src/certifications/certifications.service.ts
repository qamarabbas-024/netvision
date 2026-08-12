import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExamType, ExamAttemptStatus } from '@prisma/client';

export interface StartExamDto {
  certificationCode: string;
  type: ExamType;
}

export interface SubmitExamDto {
  answersJson?: Record<string, any>;
  practicalStateJson?: Record<string, any>;
  hintsUsed?: number;
}

export interface AnswerQuestionDto {
  questionId: string;
  selectedOption: number;
}

export interface PracticalActionDto {
  action: 'configureDevice' | 'configureInterface' | 'configureVlan' | 'addRoute' | 'updateAcl' | 'executeCommand';
  nodeId?: string;
  payload?: any;
}

export interface RequestHintDto {
  objectiveId?: string;
  hintId?: string;
}

@Injectable()
export class CertificationsService {
  private readonly logger = new Logger(CertificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listCertifications() {
    const certs = await this.prisma.certificationDefinition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    return certs.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      description: c.description,
      level: c.level,
      isActive: c.isActive,
      requirements: c.requirementsJson,
      policy: c.policyJson,
      theoryConfig: c.theoryConfigJson,
      practicalConfig: c.practicalConfigJson,
    }));
  }

  async getCertificationByCode(code: string) {
    const cert = await this.prisma.certificationDefinition.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!cert) {
      throw new NotFoundException(`Certification code "${code}" not found.`);
    }

    return {
      id: cert.id,
      code: cert.code,
      title: cert.title,
      description: cert.description,
      level: cert.level,
      isActive: cert.isActive,
      requirements: cert.requirementsJson,
      policy: cert.policyJson,
      theoryConfig: cert.theoryConfigJson,
      practicalConfig: cert.practicalConfigJson,
    };
  }

  async calculateEligibility(userId: string, code: string) {
    if (!userId) {
      throw new BadRequestException('A valid authenticated User ID is required to calculate certification eligibility.');
    }

    const cert = await this.prisma.certificationDefinition.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!cert) {
      throw new NotFoundException(`Certification code "${code}" not found.`);
    }

    const reqs: any = cert.requirementsJson || {};
    const requiredCourseCodes: string[] = reqs.requiredCourseCodes || [];
    const minAssessmentAvg: number = reqs.minAssessmentAvg || 80;

    // 1. Required Courses Completion Check
    const courses = await this.prisma.course.findMany({
      where: { code: { in: requiredCourseCodes } },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    let totalLessonsCount = 0;
    const allLessonIds: string[] = [];

    for (const c of courses) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          totalLessonsCount++;
          allLessonIds.push(l.id);
        }
      }
    }

    const completedProgressCount = await this.prisma.userProgress.count({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    });

    const coursesComplete = totalLessonsCount > 0 && completedProgressCount >= totalLessonsCount;

    // 2. Assessment Average Check
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalQuizScore = quizAttempts.reduce((acc, q) => acc + q.score, 0);
    const assessmentAvg = quizAttempts.length > 0 ? Math.round(totalQuizScore / quizAttempts.length) : 0;
    const assessmentsPassed = quizAttempts.length > 0 && assessmentAvg >= minAssessmentAvg;

    // 3. Required Practical Labs Check
    const requiredLabs = await this.prisma.lessonLab.findMany({
      where: { lessonId: { in: allLessonIds } },
    });

    const passedLabAttempts = await this.prisma.labAttempt.count({
      where: {
        userId,
        labId: { in: requiredLabs.map((l) => l.id) },
        passed: true,
      },
    });

    const labsPassed = requiredLabs.length === 0 || passedLabAttempts >= requiredLabs.length;

    // 4. Theory Exam Status
    const theoryAttempts = await this.prisma.examAttempt.findMany({
      where: { userId, certificationCode: cert.code, type: ExamType.THEORY },
      orderBy: { createdAt: 'desc' },
    });

    const latestTheory = theoryAttempts[0];
    const theoryPassed = theoryAttempts.some((a) => a.status === ExamAttemptStatus.PASSED);

    // 5. Practical Exam Status
    const practicalAttempts = await this.prisma.examAttempt.findMany({
      where: { userId, certificationCode: cert.code, type: ExamType.PRACTICAL },
      orderBy: { createdAt: 'desc' },
    });

    const latestPractical = practicalAttempts[0];
    const practicalPassed = practicalAttempts.some((a) => a.status === ExamAttemptStatus.PASSED);

    const overallEligible = coursesComplete && assessmentsPassed && labsPassed && theoryPassed && practicalPassed;

    const requirementsList = [
      {
        key: 'COURSES',
        title: `Required Courses Completed (${completedProgressCount}/${totalLessonsCount} lessons)`,
        status: coursesComplete ? 'COMPLETE' : 'INCOMPLETE',
        details: `Courses required: ${requiredCourseCodes.join(', ')}`,
      },
      {
        key: 'ASSESSMENTS',
        title: `Course Assessment Average ≥ ${minAssessmentAvg}%`,
        status: assessmentsPassed ? 'COMPLETE' : 'INCOMPLETE',
        score: assessmentAvg,
      },
      {
        key: 'LABS',
        title: `Required Practical Labs (${passedLabAttempts}/${requiredLabs.length})`,
        status: labsPassed ? 'COMPLETE' : 'INCOMPLETE',
      },
      {
        key: 'THEORY_EXAM',
        title: 'Final Theory Examination (≥ 80% Required)',
        status: theoryPassed ? 'COMPLETE' : latestTheory ? latestTheory.status : 'INCOMPLETE',
        score: latestTheory?.score || null,
      },
      {
        key: 'PRACTICAL_EXAM',
        title: 'Final Practical Network Examination',
        status: practicalPassed ? 'COMPLETE' : !theoryPassed ? 'LOCKED' : latestPractical ? latestPractical.status : 'INCOMPLETE',
        score: latestPractical?.score || null,
      },
    ];

    return {
      certificationCode: cert.code,
      certificationTitle: cert.title,
      eligible: overallEligible,
      requirements: requirementsList,
    };
  }

  // Question Domain Blueprint Builder
  private async buildTheoryExamBlueprint(targetCount = 50) {
    const rawQuestions = await this.prisma.quizQuestion.findMany({
      take: 200,
    });

    // Helper for classifying domain
    const classifyDomain = (q: any): 'CONCEPTUAL' | 'MECHANICS' | 'NUMERICAL' | 'PACKET_ANALYSIS' | 'TROUBLESHOOTING' => {
      const text = (q.questionText || '').toLowerCase();
      const concept = (q.concept || '').toLowerCase();
      const type = q.questionType;
      const cog = q.cognitiveLevel;

      if (cog === 'TROUBLESHOOTING' || type === 'TROUBLESHOOTING' || type === 'SCENARIO' || text.includes('troubleshoot') || text.includes('fail') || text.includes('error')) {
        return 'TROUBLESHOOTING';
      }
      if (type === 'PACKET_ANALYSIS' || concept.includes('packet') || concept.includes('wireshark') || concept.includes('tcp handshake') || text.includes('header') || text.includes('flag')) {
        return 'PACKET_ANALYSIS';
      }
      if (concept.includes('subnet') || concept.includes('ipv4') || concept.includes('cidr') || concept.includes('binary') || text.includes('mask') || text.includes('host')) {
        return 'NUMERICAL';
      }
      if (type === 'COMMAND_INTERPRETATION' || cog === 'UNDERSTANDING' || text.includes('protocol') || text.includes('port')) {
        return 'MECHANICS';
      }
      return 'CONCEPTUAL';
    };

    const categorized: Record<string, any[]> = {
      CONCEPTUAL: [],
      MECHANICS: [],
      NUMERICAL: [],
      PACKET_ANALYSIS: [],
      TROUBLESHOOTING: [],
    };

    for (const q of rawQuestions) {
      const d = classifyDomain(q);
      categorized[d].push({
        id: q.id,
        questionText: q.questionText,
        optionsJson: q.optionsJson,
        correctOption: q.correctOption,
        explanation: q.explanation,
        cognitiveLevel: q.cognitiveLevel,
        questionType: q.questionType,
        points: q.points,
        concept: q.concept,
        domain: d,
      });
    }

    // Blueprint Allocations (50 total questions):
    // CONCEPTUAL: 8 (16%), MECHANICS: 12 (24%), NUMERICAL: 10 (20%), PACKET_ANALYSIS: 10 (20%), TROUBLESHOOTING: 10 (20%)
    const targets: Record<string, number> = {
      CONCEPTUAL: 8,
      MECHANICS: 12,
      NUMERICAL: 10,
      PACKET_ANALYSIS: 10,
      TROUBLESHOOTING: 10,
    };

    const selectedQuestions: any[] = [];
    let synthId = 1;

    for (const [domain, target] of Object.entries(targets)) {
      const pool = categorized[domain] || [];
      const shuffled = [...pool].sort(() => 0.5 - Math.random());

      const chosenFromPool = shuffled.slice(0, target);
      selectedQuestions.push(...chosenFromPool);

      // Fill remainder for this specific domain up to target
      const needed = target - chosenFromPool.length;
      for (let i = 0; i < needed; i++) {
        const qId = `q-synth-${domain.toLowerCase()}-${synthId++}`;
        let questionText = `[NV-NET ${domain} Exam Item #${synthId}] `;
        let opts = ['Option A', 'Option B', 'Option C', 'Option D'];
        let correctIdx = 0;
        let explanation = `Correct answer for ${domain} theory item.`;

        if (domain === 'NUMERICAL') {
          questionText += `What is the usable host capacity of an IPv4 /27 subnet mask?`;
          opts = ['30 usable hosts', '32 usable hosts', '62 usable hosts', '14 usable hosts'];
          correctIdx = 0;
          explanation = `A /27 subnet leaves 5 host bits (2^5 - 2 = 30 usable hosts).`;
        } else if (domain === 'PACKET_ANALYSIS') {
          questionText += `Which TCP flag combination indicates a connection setup request in a Wireshark capture?`;
          opts = ['SYN=1, ACK=0', 'SYN=1, ACK=1', 'FIN=1, ACK=1', 'RST=1, ACK=0'];
          correctIdx = 0;
          explanation = `The first packet of the TCP 3-way handshake carries SYN=1, ACK=0.`;
        } else if (domain === 'TROUBLESHOOTING') {
          questionText += `Host 192.168.1.50/24 cannot ping default gateway 192.168.1.1. PING to localhost 127.0.0.1 succeeds. What is the probable root cause?`;
          opts = ['Layer 2 Link failure or VLAN switch port misconfiguration', 'BGP autonomous system mismatch', 'DNS server port 53 timeout', 'HTTP GET request syntax error'];
          correctIdx = 0;
          explanation = `Inability to ping local default gateway indicates Layer 1/2 physical link or VLAN isolation issue.`;
        } else if (domain === 'MECHANICS') {
          questionText += `Which OSI layer manages data link framing, MAC addressing, and hardware error detection?`;
          opts = ['Data Link Layer (Layer 2)', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Session Layer (Layer 5)'];
          correctIdx = 0;
          explanation = `Layer 2 Data Link handles Ethernet frames, MAC addresses, and CRC checksums.`;
        } else {
          questionText += `What is the primary architectural purpose of protocol encapsulation across OSI layers?`;
          opts = ['To append layer-specific header control information as data traverses down the stack', 'To compress text payload bytes', 'To randomize physical cable voltages', 'To bypass firewall port filters'];
          correctIdx = 0;
          explanation = `Encapsulation wraps data in protocol headers (L4 segment -> L3 packet -> L2 frame).`;
        }

        selectedQuestions.push({
          id: qId,
          questionText,
          optionsJson: opts,
          correctOption: correctIdx,
          explanation,
          cognitiveLevel: domain === 'TROUBLESHOOTING' ? 'TROUBLESHOOTING' : 'UNDERSTANDING',
          questionType: domain === 'TROUBLESHOOTING' ? 'TROUBLESHOOTING' : 'MULTIPLE_CHOICE',
          points: 10,
          concept: domain,
          domain,
        });
      }
    }

    return selectedQuestions.slice(0, targetCount);
  }

  // Strip correct answers & explanations before sending question payload to client
  // Practical Exam Scenario Builder (NV-NET 5-Node Topology)
  public buildPracticalExamScenario(scenarioCode = 'NV-NET-PRACTICAL-SCENARIO-1') {
    const topologyState = {
      scenarioCode,
      nodes: [
        {
          id: 'PC-1',
          name: 'PC-1',
          type: 'PC',
          ip: '192.168.1.50',
          netmask: '255.255.255.128', // INJECTION: Mismatched subnet mask (should be 255.255.255.0)
          defaultGateway: '192.168.1.1',
          vlan: 10,
          primaryDns: '10.0.0.99', // INJECTION: Invalid DNS resolver IP (should be 172.16.0.10)
        },
        {
          id: 'SWITCH-A',
          name: 'SWITCH-A',
          type: 'SWITCH',
          ports: [
            { port: 'FastEthernet0/1', vlan: 99, targetDevice: 'PC-1' }, // INJECTION: Misassigned VLAN (should be 10)
            { port: 'FastEthernet0/24', vlan: 10, targetDevice: 'ROUTER-A' },
          ],
        },
        {
          id: 'ROUTER-A',
          name: 'ROUTER-A',
          type: 'ROUTER',
          interfaces: [
            { name: 'Gi0/0', ip: '192.168.1.1', netmask: '255.255.255.0', vlan: 10, status: 'down' }, // INJECTION: Disabled interface
            { name: 'Gi0/1', ip: '10.0.0.1', netmask: '255.255.255.252', status: 'up' },
          ],
          routes: [], // INJECTION: Missing static route to 172.16.0.0/24 via 10.0.0.2
        },
        {
          id: 'FIREWALL',
          name: 'FIREWALL',
          type: 'FIREWALL',
          interfaces: [
            { name: 'eth0', ip: '10.0.0.2', netmask: '255.255.255.252', status: 'up' },
            { name: 'eth1', ip: '172.16.0.1', netmask: '255.255.255.0', status: 'up' },
          ],
          aclRules: [
            { id: 'acl-101', src: '192.168.1.0/24', dst: '172.16.0.10/32', port: 80, protocol: 'TCP', action: 'DENY' }, // INJECTION: Blocked HTTP
          ],
        },
        {
          id: 'SERVER',
          name: 'SERVER',
          type: 'SERVER',
          ip: '172.16.0.10',
          netmask: '255.255.255.0',
          defaultGateway: '172.16.0.1',
          services: [
            { name: 'HTTP', port: 80, status: 'running' },
            { name: 'DNS', port: 53, status: 'running', records: { 'app.netvision.local': '172.16.0.10' } },
          ],
        },
      ],
    };

    const objectives = [
      {
        id: 'OBJ_IP_GATEWAY',
        category: 'IP_CONFIG',
        title: 'IPv4 & Default Gateway Configuration',
        description: 'Configure PC-1 IPv4 subnet mask to 255.255.255.0 and default gateway to 192.168.1.1.',
        weight: 15,
        critical: true,
        hint: 'Check ipconfig on PC-1. Subnet mask 255.255.255.128 restricts host addressing; update netmask to 255.255.255.0.',
      },
      {
        id: 'OBJ_SWITCH_VLAN',
        category: 'VLAN_CONFIG',
        title: 'Switch Port VLAN Assignment',
        description: 'Reassign SWITCH-A port FastEthernet0/1 to access VLAN 10.',
        weight: 15,
        critical: false,
        hint: 'Port Fa0/1 is currently assigned to VLAN 99. Reassign Fa0/1 to access VLAN 10.',
      },
      {
        id: 'OBJ_ROUTER_LINK_ROUTE',
        category: 'ROUTING',
        title: 'Router Interface Enablement & Static Route',
        description: 'Enable ROUTER-A interface Gi0/0 and configure static route 172.16.0.0/24 via next-hop 10.0.0.2.',
        weight: 25,
        critical: true,
        hint: 'Interface Gi0/0 is administratively down. Enable Gi0/0 and add static route for 172.16.0.0/24 via 10.0.0.2.',
      },
      {
        id: 'OBJ_FIREWALL_ACL',
        category: 'FIREWALL',
        title: 'Perimeter Firewall HTTP Access Control',
        description: 'Update FIREWALL ACL rule acl-101 to PERMIT HTTP (TCP 80) traffic from 192.168.1.0/24 to 172.16.0.10.',
        weight: 15,
        critical: false,
        hint: 'ACL rule acl-101 is configured to DENY TCP port 80 traffic. Change rule action to PERMIT.',
      },
      {
        id: 'OBJ_DNS_SERVICES',
        category: 'DNS_SERVICES',
        title: 'DNS Resolver Provisioning',
        description: 'Configure PC-1 primary DNS resolver address to 172.16.0.10.',
        weight: 15,
        critical: false,
        hint: 'PC-1 primary DNS is set to 10.0.0.99. Update primary DNS IP to 172.16.0.10.',
      },
      {
        id: 'OBJ_END_TO_END',
        category: 'TROUBLESHOOTING',
        title: 'End-to-End Reachability & Service Verification',
        description: 'Verify full end-to-end IP connectivity and HTTP access from PC-1 to SERVER.',
        weight: 15,
        critical: true,
        hint: 'Ensure all previous IP, VLAN, interface, routing, and firewall requirements are satisfied.',
      },
    ];

    return {
      scenarioCode,
      topologyState,
      objectives,
    };
  }

  // Server-Side Practical Network State Evaluator
  public evaluatePracticalState(topologyState: any, objectives: any[]) {
    const nodes: any[] = topologyState.nodes || [];
    const pc1 = nodes.find((n) => n.id === 'PC-1');
    const switchA = nodes.find((n) => n.id === 'SWITCH-A');
    const routerA = nodes.find((n) => n.id === 'ROUTER-A');
    const firewall = nodes.find((n) => n.id === 'FIREWALL');

    const switchPort1 = (switchA?.ports || []).find((p: any) => p.port === 'FastEthernet0/1');
    const routerGi0 = (routerA?.interfaces || []).find((i: any) => i.name === 'Gi0/0');
    const routerRoutes = routerA?.routes || [];
    const acl101 = (firewall?.aclRules || []).find((r: any) => r.id === 'acl-101');

    const objIpPassed = pc1?.netmask === '255.255.255.0' && pc1?.defaultGateway === '192.168.1.1' && pc1?.ip === '192.168.1.50';
    const objVlanPassed = switchPort1?.vlan === 10;
    const objRoutePassed = routerGi0?.status === 'up' && routerRoutes.some((r: any) => (r.destination === '172.16.0.0/24' || r.destination === '172.16.0.0') && r.nextHop === '10.0.0.2');
    const objAclPassed = acl101?.action === 'PERMIT';
    const objDnsPassed = pc1?.primaryDns === '172.16.0.10';
    const objEndToEndPassed = objIpPassed && objVlanPassed && objRoutePassed && objAclPassed && objDnsPassed;

    const passMap: Record<string, boolean> = {
      OBJ_IP_GATEWAY: objIpPassed,
      OBJ_SWITCH_VLAN: objVlanPassed,
      OBJ_ROUTER_LINK_ROUTE: objRoutePassed,
      OBJ_FIREWALL_ACL: objAclPassed,
      OBJ_DNS_SERVICES: objDnsPassed,
      OBJ_END_TO_END: objEndToEndPassed,
    };

    let baseScore = 0;
    let allCriticalPassed = true;

    const objectiveResults = (objectives || []).map((obj: any) => {
      const objId = obj.id || obj.objectiveId;
      const isPassed = !!passMap[objId];
      if (isPassed) {
        baseScore += obj.weight || 0;
      }
      if (obj.critical && !isPassed) {
        allCriticalPassed = false;
      }
      return {
        objectiveId: objId,
        category: obj.category,
        title: obj.title,
        description: obj.description,
        weight: obj.weight,
        critical: obj.critical,
        status: isPassed ? 'PASSED' : 'FAILED',
      };
    });

    return {
      baseScore,
      allCriticalPassed,
      objectiveResults,
    };
  }

  private sanitizeQuestionsForClient(questions: any[]) {
    return questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionsJson: q.optionsJson,
      cognitiveLevel: q.cognitiveLevel,
      questionType: q.questionType,
      points: q.points || 10,
      concept: q.concept,
      domain: q.domain,
    }));
  }

  async startExamAttempt(userId: string, dto: StartExamDto) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required to start a final certification exam attempt.');
    }

    const cert = await this.prisma.certificationDefinition.findUnique({
      where: { code: dto.certificationCode.toUpperCase() },
    });

    if (!cert) {
      throw new NotFoundException(`Certification code "${dto.certificationCode}" not found.`);
    }

    // PRACTICAL EXAM PREREQUISITES CHECK
    if (dto.type === ExamType.PRACTICAL) {
      const theoryPassed = await this.prisma.examAttempt.findFirst({
        where: {
          userId,
          certificationCode: cert.code,
          type: ExamType.THEORY,
          status: ExamAttemptStatus.PASSED,
        },
      });

      if (!theoryPassed) {
        throw new BadRequestException(
          'Final theory examination must be completed and passed before starting the final practical network examination.'
        );
      }

      const eligibility = await this.calculateEligibility(userId, cert.code);
      const coursesReq = eligibility.requirements.find((r) => r.key === 'COURSES');
      const labsReq = eligibility.requirements.find((r) => r.key === 'LABS');

      if (coursesReq?.status !== 'COMPLETE' || labsReq?.status !== 'COMPLETE') {
        throw new BadRequestException(
          'Course completion and required practical labs must be satisfied before starting the final practical examination.'
        );
      }
    }

    const policy: any = cert.policyJson || {};
    const maxAttempts = policy.maxAttempts || 3;
    const rollingWindowDays = policy.rollingWindowDays || 30;
    const cooldownFirst = policy.cooldownAfterFirstFailure || 86400; // 24 hours
    const cooldownSubsequent = policy.cooldownAfterSubsequentFailure || 259200; // 72 hours

    const windowStart = new Date(Date.now() - rollingWindowDays * 24 * 60 * 60 * 1000);

    // 1. Rolling window attempt limit check
    const recentAttempts = await this.prisma.examAttempt.findMany({
      where: {
        userId,
        certificationCode: cert.code,
        type: dto.type,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentAttempts.length >= maxAttempts) {
      throw new BadRequestException(
        `Maximum exam attempt limit (${maxAttempts} attempts per ${rollingWindowDays} days) reached for ${dto.type} exam.`
      );
    }

    // 2. Cooldown period check if previous attempt failed
    const latestAttempt = recentAttempts[0];
    if (latestAttempt && latestAttempt.status === ExamAttemptStatus.FAILED) {
      const cooldownSec = recentAttempts.length === 1 ? cooldownFirst : cooldownSubsequent;
      const cooldownEnds = new Date(new Date(latestAttempt.updatedAt).getTime() + cooldownSec * 1000);

      if (new Date() < cooldownEnds) {
        const remainingMinutes = Math.ceil((cooldownEnds.getTime() - Date.now()) / (60 * 1000));
        throw new BadRequestException(
          `Exam attempt cooldown active. You must wait ${remainingMinutes} minutes before retrying this exam.`
        );
      }
    }

    // 3. Active running exam check
    const activeAttempt = recentAttempts.find(
      (a) => a.status === ExamAttemptStatus.IN_PROGRESS && new Date() < new Date(a.expiresAt)
    );
    if (activeAttempt) {
      const configSnapshot: any = activeAttempt.configSnapshotJson || {};
      if (dto.type === ExamType.PRACTICAL) {
        const topologyState = configSnapshot.topologyState || {};
        const objectives = configSnapshot.objectives || [];
        const evaluated = this.evaluatePracticalState(topologyState, objectives);

        return {
          attemptId: activeAttempt.id,
          certificationCode: activeAttempt.certificationCode,
          type: activeAttempt.type,
          status: activeAttempt.status,
          startedAt: activeAttempt.startedAt,
          expiresAt: activeAttempt.expiresAt,
          attemptNumber: activeAttempt.attemptNumber,
          scenarioCode: configSnapshot.scenarioCode,
          topologyState,
          objectives: evaluated.objectiveResults,
          hintsUsed: configSnapshot.hintsUsed || 0,
          maximumHints: configSnapshot.maximumHints || 2,
          hintPenalty: configSnapshot.hintPenalty || 5,
        };
      }

      const savedQuestions = configSnapshot.questions || [];
      return {
        attemptId: activeAttempt.id,
        certificationCode: activeAttempt.certificationCode,
        type: activeAttempt.type,
        status: activeAttempt.status,
        startedAt: activeAttempt.startedAt,
        expiresAt: activeAttempt.expiresAt,
        attemptNumber: activeAttempt.attemptNumber,
        questionCount: savedQuestions.length,
        questions: this.sanitizeQuestionsForClient(savedQuestions),
      };
    }

    // 4. Server-owned time calculation & snapshot building
    const config: any = dto.type === ExamType.THEORY ? cert.theoryConfigJson : cert.practicalConfigJson;
    const durationSeconds = config?.durationSeconds || (dto.type === ExamType.PRACTICAL ? 5400 : 3600);

    let configSnapshotJson: any = {};
    let questionsSnapshot: any[] = [];

    if (dto.type === ExamType.THEORY) {
      questionsSnapshot = await this.buildTheoryExamBlueprint(config?.questionCount || 50);
      configSnapshotJson = {
        ...config,
        questions: questionsSnapshot,
      };
    } else {
      const scenario = this.buildPracticalExamScenario(config?.scenarioCode || 'NV-NET-PRACTICAL-SCENARIO-1');
      configSnapshotJson = {
        ...config,
        scenarioCode: scenario.scenarioCode,
        topologyState: scenario.topologyState,
        objectives: scenario.objectives,
        hintsUsed: 0,
        usedHintIds: [],
        maximumHints: config?.maximumHints || 2,
        hintPenalty: config?.hintPenalty || 5,
        actionLog: [],
      };
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationSeconds * 1000);
    const attemptNumber = recentAttempts.length + 1;

    const attempt = await this.prisma.examAttempt.create({
      data: {
        userId,
        certificationCode: cert.code,
        type: dto.type,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
        attemptNumber,
        configSnapshotJson,
        resultMetadataJson: {
          answersJson: {},
        },
      },
    });

    this.logger.log(
      `Started ${dto.type} Exam Attempt [${attempt.id}] for user ${userId} (Attempt #${attemptNumber}, Duration: ${durationSeconds}s, Expires: ${expiresAt.toISOString()})`
    );

    if (dto.type === ExamType.PRACTICAL) {
      const topologyState = configSnapshotJson.topologyState || {};
      const objectives = configSnapshotJson.objectives || [];
      const evaluated = this.evaluatePracticalState(topologyState, objectives);

      return {
        attemptId: attempt.id,
        certificationCode: attempt.certificationCode,
        type: attempt.type,
        status: attempt.status,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        durationSeconds,
        attemptNumber: attempt.attemptNumber,
        scenarioCode: configSnapshotJson.scenarioCode,
        topologyState,
        objectives: evaluated.objectiveResults,
        hintsUsed: 0,
        maximumHints: configSnapshotJson.maximumHints || 2,
        hintPenalty: configSnapshotJson.hintPenalty || 5,
      };
    }

    return {
      attemptId: attempt.id,
      certificationCode: attempt.certificationCode,
      type: attempt.type,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      durationSeconds,
      attemptNumber: attempt.attemptNumber,
      questionCount: questionsSnapshot.length,
      questions: this.sanitizeQuestionsForClient(questionsSnapshot),
    };
  }

  async getAttemptStatus(userId: string, attemptId: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt "${attemptId}" not found.`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied to exam attempt "${attemptId}". You do not own this attempt.`);
    }

    const now = new Date();
    if (attempt.status === ExamAttemptStatus.IN_PROGRESS && now > new Date(attempt.expiresAt)) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED },
      });
      attempt.status = ExamAttemptStatus.EXPIRED;
    }

    const configSnapshot: any = attempt.configSnapshotJson || {};
    const remainingSeconds = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - now.getTime()) / 1000));

    if (attempt.type === ExamType.PRACTICAL) {
      const topologyState = configSnapshot.topologyState || {};
      const objectives = configSnapshot.objectives || [];
      const evaluated = this.evaluatePracticalState(topologyState, objectives);

      return {
        attemptId: attempt.id,
        certificationCode: attempt.certificationCode,
        type: attempt.type,
        status: attempt.status,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        submittedAt: attempt.submittedAt,
        remainingSeconds,
        score: attempt.score,
        passed: attempt.passed,
        attemptNumber: attempt.attemptNumber,
        scenarioCode: configSnapshot.scenarioCode,
        topologyState,
        objectives: evaluated.objectiveResults,
        hintsUsed: configSnapshot.hintsUsed || 0,
        maximumHints: configSnapshot.maximumHints || 2,
        hintPenalty: configSnapshot.hintPenalty || 5,
        usedHintIds: configSnapshot.usedHintIds || [],
      };
    }

    const questions = configSnapshot.questions || [];

    return {
      attemptId: attempt.id,
      certificationCode: attempt.certificationCode,
      type: attempt.type,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      submittedAt: attempt.submittedAt,
      remainingSeconds,
      score: attempt.score,
      passed: attempt.passed,
      attemptNumber: attempt.attemptNumber,
      questionCount: questions.length,
      questions: this.sanitizeQuestionsForClient(questions),
      answersJson: (attempt.resultMetadataJson as any)?.answersJson || {},
    };
  }

  async answerQuestion(userId: string, attemptId: string, dto: AnswerQuestionDto) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt "${attemptId}" not found.`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied to exam attempt "${attemptId}". You do not own this attempt.`);
    }

    const now = new Date();
    if (now > new Date(attempt.expiresAt) || attempt.status === ExamAttemptStatus.EXPIRED) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED },
      });
      throw new BadRequestException(`Exam attempt "${attemptId}" has expired. Answer submission blocked.`);
    }

    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(`Exam attempt "${attemptId}" is in status ${attempt.status}. Answers cannot be modified.`);
    }

    const resultMeta: any = attempt.resultMetadataJson || {};
    const answersJson = resultMeta.answersJson || {};

    answersJson[dto.questionId] = dto.selectedOption;

    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        resultMetadataJson: {
          ...resultMeta,
          answersJson,
        },
      },
    });

    return {
      attemptId: updated.id,
      questionId: dto.questionId,
      selectedOption: dto.selectedOption,
      saved: true,
      totalAnswered: Object.keys(answersJson).length,
    };
  }

  async executePracticalAction(userId: string, attemptId: string, dto: PracticalActionDto) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Practical exam attempt "${attemptId}" not found.`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied to exam attempt "${attemptId}". You do not own this attempt.`);
    }

    if (attempt.type !== ExamType.PRACTICAL) {
      throw new BadRequestException(`Attempt "${attemptId}" is not a practical examination.`);
    }

    const now = new Date();
    if (now > new Date(attempt.expiresAt) || attempt.status === ExamAttemptStatus.EXPIRED) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED },
      });
      throw new BadRequestException(`Exam attempt "${attemptId}" has expired. Configuration actions locked.`);
    }

    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(`Exam attempt "${attemptId}" is in status ${attempt.status}. Configuration actions locked.`);
    }

    const configSnapshot: any = attempt.configSnapshotJson || {};
    const topologyState: any = configSnapshot.topologyState || { nodes: [] };
    const nodes: any[] = topologyState.nodes || [];

    let commandOutput = '';
    const actionType = dto.action;
    const nodeId = dto.nodeId;
    const payload = dto.payload || {};

    const targetNode = nodes.find((n) => n.id === nodeId || n.name === nodeId);

    if (actionType === 'configureDevice' && targetNode) {
      if (payload.ip !== undefined) targetNode.ip = payload.ip;
      if (payload.netmask !== undefined) targetNode.netmask = payload.netmask;
      if (payload.defaultGateway !== undefined) targetNode.defaultGateway = payload.defaultGateway;
      if (payload.primaryDns !== undefined) targetNode.primaryDns = payload.primaryDns;
      commandOutput = `Configuration applied on ${targetNode.name}: IP=${targetNode.ip}, Netmask=${targetNode.netmask}, GW=${targetNode.defaultGateway}, DNS=${targetNode.primaryDns}`;
    } else if (actionType === 'configureInterface' && targetNode) {
      const ifaceName = payload.interfaceName || payload.name;
      const iface = (targetNode.interfaces || []).find((i: any) => i.name === ifaceName);
      if (iface) {
        if (payload.status !== undefined) iface.status = payload.status;
        if (payload.ip !== undefined) iface.ip = payload.ip;
        if (payload.netmask !== undefined) iface.netmask = payload.netmask;
        commandOutput = `Interface ${ifaceName} on ${targetNode.name} updated: status=${iface.status}, ip=${iface.ip}/${iface.netmask}`;
      } else {
        commandOutput = `Interface ${ifaceName} not found on ${targetNode.name}`;
      }
    } else if (actionType === 'configureVlan' && targetNode) {
      const portName = payload.port;
      const vlanNum = parseInt(payload.vlan, 10);
      const port = (targetNode.ports || []).find((p: any) => p.port === portName);
      if (port) {
        port.vlan = vlanNum;
        commandOutput = `Switch port ${portName} on ${targetNode.name} assigned to access VLAN ${vlanNum}`;
      } else {
        commandOutput = `Port ${portName} not found on ${targetNode.name}`;
      }
    } else if (actionType === 'addRoute' && targetNode) {
      targetNode.routes = targetNode.routes || [];
      const dest = payload.destination;
      const nh = payload.nextHop;
      const iface = payload.interface || 'Gi0/1';
      targetNode.routes.push({ destination: dest, nextHop: nh, interface: iface });
      commandOutput = `Static route added on ${targetNode.name}: ${dest} via ${nh} dev ${iface}`;
    } else if (actionType === 'updateAcl' && targetNode) {
      const aclId = payload.aclId || 'acl-101';
      const action = (payload.action || 'PERMIT').toUpperCase();
      const aclRule = (targetNode.aclRules || []).find((r: any) => r.id === aclId);
      if (aclRule) {
        aclRule.action = action;
        commandOutput = `Firewall ACL rule ${aclId} updated: action set to ${action}`;
      } else {
        commandOutput = `ACL rule ${aclId} not found on ${targetNode.name}`;
      }
    } else if (actionType === 'executeCommand') {
      const rawCmd = (payload.command || '').trim();
      const lowerCmd = rawCmd.toLowerCase();

      if (lowerCmd.startsWith('ping')) {
        const destIp = rawCmd.split(' ')[1] || '172.16.0.10';
        const evalRes = this.evaluatePracticalState(topologyState, configSnapshot.objectives || []);
        if (evalRes.allCriticalPassed) {
          commandOutput = `PING ${destIp} (${destIp}): 56 data bytes\n64 bytes from ${destIp}: icmp_seq=1 ttl=62 time=2.1 ms\n64 bytes from ${destIp}: icmp_seq=2 ttl=62 time=1.8 ms\n64 bytes from ${destIp}: icmp_seq=3 ttl=62 time=2.0 ms\n--- ${destIp} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2004ms`;
        } else {
          commandOutput = `PING ${destIp} (${destIp}): 56 data bytes\nRequest timeout for icmp_seq 1\nRequest timeout for icmp_seq 2\nRequest timeout for icmp_seq 3\n--- ${destIp} ping statistics ---\n3 packets transmitted, 0 received, 100% packet loss`;
        }
      } else if (lowerCmd.startsWith('nslookup')) {
        const host = rawCmd.split(' ')[1] || 'app.netvision.local';
        const pcNode = nodes.find((n) => n.id === 'PC-1');
        const evalRes = this.evaluatePracticalState(topologyState, configSnapshot.objectives || []);
        if (pcNode && pcNode.primaryDns === '172.16.0.10' && evalRes.allCriticalPassed) {
          commandOutput = `Server: 172.16.0.10\nAddress: 172.16.0.10#53\n\nName: ${host}\nAddress: 172.16.0.10`;
        } else {
          commandOutput = `*** DNS server failed: connection timed out / server unreachable`;
        }
      } else if (lowerCmd.startsWith('ipconfig') || lowerCmd.startsWith('ifconfig')) {
        const pcNode = nodes.find((n) => n.id === 'PC-1');
        commandOutput = `Ethernet adapter Local Area Connection:\n   IPv4 Address. . . . . . . . . . . : ${pcNode?.ip}\n   Subnet Mask . . . . . . . . . . . : ${pcNode?.netmask}\n   Default Gateway . . . . . . . . . : ${pcNode?.defaultGateway}\n   DNS Servers . . . . . . . . . . . : ${pcNode?.primaryDns}`;
      } else if (lowerCmd.includes('show ip route')) {
        const rNode = nodes.find((n) => n.id === 'ROUTER-A');
        const routesText = (rNode?.routes || []).map((r: any) => `S*   ${r.destination} [1/0] via ${r.nextHop}`).join('\n');
        commandOutput = `Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP\nGateway of last resort is not set\n\n10.0.0.0/30 is subnetted, 1 subnets\nC    10.0.0.0 is directly connected, GigabitEthernet0/1\n192.168.1.0/24 is subnetted, 1 subnets\nC    192.168.1.0 is directly connected, GigabitEthernet0/0\n${routesText}`;
      } else if (lowerCmd.includes('show vlan')) {
        const sNode = nodes.find((n) => n.id === 'SWITCH-A');
        const portsText = (sNode?.ports || []).map((p: any) => `${p.vlan}    VLAN00${p.vlan}                          active    ${p.port}`).join('\n');
        commandOutput = `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Fa0/2, Fa0/3, Fa0/4\n${portsText}`;
      } else {
        commandOutput = `Command '${rawCmd}' executed successfully on ${targetNode?.name || 'node'}. State updated.`;
      }
    }

    const actionLog = configSnapshot.actionLog || [];
    actionLog.push({ timestamp: now.toISOString(), action: actionType, nodeId, payload, output: commandOutput });
    configSnapshot.actionLog = actionLog;

    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        configSnapshotJson: {
          ...configSnapshot,
          topologyState,
        },
      },
    });

    const evaluated = this.evaluatePracticalState(topologyState, configSnapshot.objectives || []);

    return {
      attemptId: updated.id,
      action: actionType,
      commandOutput,
      topologyState,
      objectives: evaluated.objectiveResults,
      baseScore: evaluated.baseScore,
      allCriticalPassed: evaluated.allCriticalPassed,
    };
  }

  async requestPracticalHint(userId: string, attemptId: string, dto: RequestHintDto) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Practical exam attempt "${attemptId}" not found.`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied to exam attempt "${attemptId}". You do not own this attempt.`);
    }

    if (attempt.type !== ExamType.PRACTICAL) {
      throw new BadRequestException(`Attempt "${attemptId}" is not a practical examination.`);
    }

    const now = new Date();
    if (now > new Date(attempt.expiresAt) || attempt.status === ExamAttemptStatus.EXPIRED) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED },
      });
      throw new BadRequestException(`Exam attempt "${attemptId}" has expired. Hints locked.`);
    }

    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(`Exam attempt "${attemptId}" is in status ${attempt.status}. Hints locked.`);
    }

    const configSnapshot: any = attempt.configSnapshotJson || {};
    let hintsUsed = configSnapshot.hintsUsed || 0;
    const maxHints = configSnapshot.maximumHints || 2;
    const usedHintIds: string[] = configSnapshot.usedHintIds || [];
    const objectives: any[] = configSnapshot.objectives || [];

    if (hintsUsed >= maxHints) {
      throw new BadRequestException(`Maximum hint limit (${maxHints} hints) reached for this practical exam attempt.`);
    }

    const targetObjective = objectives.find(
      (o) => o.id === dto.objectiveId || o.id === dto.hintId || (!dto.objectiveId && !dto.hintId && !usedHintIds.includes(o.id))
    ) || objectives[0];

    if (!targetObjective) {
      throw new NotFoundException('Objective hint not found.');
    }

    if (usedHintIds.includes(targetObjective.id)) {
      throw new BadRequestException(`Hint for objective "${targetObjective.id}" has already been requested for this attempt.`);
    }

    usedHintIds.push(targetObjective.id);
    hintsUsed += 1;

    configSnapshot.hintsUsed = hintsUsed;
    configSnapshot.usedHintIds = usedHintIds;

    await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        configSnapshotJson: configSnapshot,
      },
    });

    return {
      attemptId: attempt.id,
      objectiveId: targetObjective.id,
      hintText: targetObjective.hint,
      hintsUsed,
      remainingHints: maxHints - hintsUsed,
      penaltyPercentage: hintsUsed * 5,
    };
  }

  async submitExamAttempt(userId: string, attemptId: string, dto: SubmitExamDto) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required to submit an exam attempt.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { certification: true },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt "${attemptId}" not found.`);
    }

    // Security Ownership Verification
    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied to exam attempt "${attemptId}". You do not own this attempt.`);
    }

    // IDEMPOTENCY CHECK: Return existing result if already finalized
    if (attempt.status === ExamAttemptStatus.PASSED || attempt.status === ExamAttemptStatus.FAILED) {
      const resultMeta: any = attempt.resultMetadataJson || {};
      return {
        attemptId: attempt.id,
        certificationCode: attempt.certificationCode,
        type: attempt.type,
        status: attempt.status,
        score: attempt.score,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
        domainScores: resultMeta.domainScores || {},
        correctCount: resultMeta.correctCount || 0,
        incorrectCount: resultMeta.incorrectCount || 0,
        baseScore: resultMeta.baseScore,
        hintPenalty: resultMeta.hintPenalty,
        finalScore: resultMeta.finalScore || attempt.score,
        objectiveResults: resultMeta.objectiveResults || [],
        isIdempotent: true,
      };
    }

    // Server-Side Time Authority Check
    const now = new Date();
    if (now > new Date(attempt.expiresAt) || attempt.status === ExamAttemptStatus.EXPIRED) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED, score: 0, passed: false },
      });
      return {
        attemptId: attempt.id,
        certificationCode: attempt.certificationCode,
        type: attempt.type,
        status: ExamAttemptStatus.EXPIRED,
        score: 0,
        passed: false,
        submittedAt: now,
        isExpired: true,
      };
    }

    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(`Exam attempt "${attemptId}" is in status ${attempt.status} and cannot be submitted again.`);
    }

    const configSnapshot: any = attempt.configSnapshotJson || {};

    // PRACTICAL EXAM FINAL EVALUATION
    if (attempt.type === ExamType.PRACTICAL) {
      const topologyState: any = configSnapshot.topologyState || { nodes: [] };
      const objectives: any[] = configSnapshot.objectives || [];

      const evaluated = this.evaluatePracticalState(topologyState, objectives);
      const hintsUsed = configSnapshot.hintsUsed || 0;
      const hintPenalty = hintsUsed * 5; // 5 percentage points penalty per hint
      const baseScore = evaluated.baseScore;
      const finalScore = Math.max(0, baseScore - hintPenalty);

      const passingScore = configSnapshot.passingScore || 80;
      const passed = finalScore >= passingScore && evaluated.allCriticalPassed;
      const status = passed ? ExamAttemptStatus.PASSED : ExamAttemptStatus.FAILED;

      const updated = await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          status,
          score: finalScore,
          passed,
          submittedAt: now,
          resultMetadataJson: {
            baseScore,
            hintPenalty,
            finalScore,
            passingScore,
            allCriticalPassed: evaluated.allCriticalPassed,
            objectiveResults: evaluated.objectiveResults,
            hintsUsed,
            submittedAt: now,
          },
        },
      });

      this.logger.log(
        `Final Practical Exam Attempt [${attemptId}] submitted by user ${userId}. Score: ${finalScore}% (Base: ${baseScore}%, Hint Penalty: -${hintPenalty}%, Critical Passed: ${evaluated.allCriticalPassed}). Result: ${status}`
      );

      return {
        attemptId: updated.id,
        certificationCode: updated.certificationCode,
        type: updated.type,
        status: updated.status,
        score: updated.score,
        passed: updated.passed,
        submittedAt: updated.submittedAt,
        baseScore,
        hintPenalty,
        finalScore,
        allCriticalPassed: evaluated.allCriticalPassed,
        objectiveResults: evaluated.objectiveResults,
        hintsUsed,
      };
    }

    // THEORY EXAM FINAL EVALUATION
    const resultMeta: any = attempt.resultMetadataJson || {};
    const answersMap = dto.answersJson || resultMeta.answersJson || {};
    const questions: any[] = configSnapshot.questions || [];

    const passingScore = configSnapshot.passingScore || 80;
    const troubleshootingMinimum = configSnapshot.troubleshootingMinimum || 70;

    let correctCount = 0;
    let incorrectCount = 0;

    const domainTotals: Record<string, { correct: number; total: number }> = {
      CONCEPTUAL: { correct: 0, total: 0 },
      MECHANICS: { correct: 0, total: 0 },
      NUMERICAL: { correct: 0, total: 0 },
      PACKET_ANALYSIS: { correct: 0, total: 0 },
      TROUBLESHOOTING: { correct: 0, total: 0 },
    };

    for (const q of questions) {
      const domain = q.domain || 'CONCEPTUAL';
      if (!domainTotals[domain]) {
        domainTotals[domain] = { correct: 0, total: 0 };
      }
      domainTotals[domain].total += 1;

      const userChoice = answersMap[q.id];
      if (userChoice !== undefined && userChoice === q.correctOption) {
        correctCount++;
        domainTotals[domain].correct += 1;
      } else {
        incorrectCount++;
      }
    }

    const totalQuestionsCount = Math.max(1, questions.length);
    const overallScorePercent = Math.round((correctCount / totalQuestionsCount) * 100);

    const domainScores: Record<string, number> = {};
    for (const [d, stats] of Object.entries(domainTotals)) {
      domainScores[d] = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 100;
    }

    const troubleshootingScore = domainScores['TROUBLESHOOTING'] !== undefined ? domainScores['TROUBLESHOOTING'] : 100;

    const passed = overallScorePercent >= passingScore && troubleshootingScore >= troubleshootingMinimum;
    const status = passed ? ExamAttemptStatus.PASSED : ExamAttemptStatus.FAILED;

    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status,
        score: overallScorePercent,
        passed,
        submittedAt: now,
        resultMetadataJson: {
          answersJson: answersMap,
          overallScore: overallScorePercent,
          passingScore,
          troubleshootingMinimum,
          domainScores,
          correctCount,
          incorrectCount,
          totalQuestionsCount,
          submittedAt: now,
        },
      },
    });

    this.logger.log(
      `Final Theory Exam Attempt [${attemptId}] submitted by user ${userId}. Score: ${overallScorePercent}% (Troubleshooting: ${troubleshootingScore}%). Result: ${status}`
    );

    return {
      attemptId: updated.id,
      certificationCode: updated.certificationCode,
      type: updated.type,
      status: updated.status,
      score: updated.score,
      passed: updated.passed,
      submittedAt: updated.submittedAt,
      domainScores,
      correctCount,
      incorrectCount,
      totalQuestionsCount,
    };
  }
}
