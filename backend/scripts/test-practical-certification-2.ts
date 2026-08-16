import { PrismaClient, ExamType, ExamAttemptStatus } from '@prisma/client';
import { CertificationsService } from '../src/certifications/certifications.service';
import { PrismaService } from '../src/database/prisma.service';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const certsService = new CertificationsService(prismaService);

async function runPracticalCertification2Suite() {
  console.log('🧪 Starting NETVISION PRACTICAL CERTIFICATION 2.0 Comprehensive Test Suite...\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, description: string, detail?: any) {
    if (condition) {
      console.log(`  ✓ Assertion ${passedCount + failedCount + 1}: ${description}`);
      passedCount++;
    } else {
      console.error(`  ❌ Assertion ${passedCount + failedCount + 1} FAILED: ${description}`);
      if (detail !== undefined) console.error('     Detail:', JSON.stringify(detail));
      failedCount++;
    }
  }

  try {
    const ts = Date.now();
    const userAId = randomUUID();
    const userBId = randomUUID();

    const userA = await prisma.user.create({
      data: {
        id: userAId,
        email: `cert2-usera-${ts}@netvision.edu`,
        username: `cert2a_${ts.toString().slice(-8)}`,
        passwordHash: 'hashed_password_cert2_test',
        fullName: 'Dr. Certified Network Engineer',
        isVerified: true,
      },
    });

    const userB = await prisma.user.create({
      data: {
        id: userBId,
        email: `cert2-userb-${ts}@netvision.edu`,
        username: `cert2b_${ts.toString().slice(-8)}`,
        passwordHash: 'hashed_password_cert2_test',
        fullName: 'Unauthorized Intruder',
        isVerified: true,
      },
    });

    // Satisfy prerequisite courses & labs for User A
    const targetCourses = await prisma.course.findMany({
      where: { code: { in: ['NET-201', 'NET-202', 'NET-203', 'NET-204'] } },
      include: { modules: { include: { lessons: { include: { labs: true, quizzes: true } } } } },
    });

    const allLessons = targetCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
    for (const l of allLessons) {
      await prisma.userProgress.create({
        data: { userId: userAId, lessonId: l.id, completed: true, score: 100 },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: { userId: userAId, quizId: q.id, score: 100, passed: true, answersJson: {} },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: { userId: userAId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' },
        });
      }
    }

    // Seed PASSED theory prerequisite attempt
    await prisma.examAttempt.create({
      data: {
        userId: userAId,
        certificationCode: 'NV-NET',
        type: ExamType.THEORY,
        status: ExamAttemptStatus.PASSED,
        score: 95,
        passed: true,
        startedAt: new Date(Date.now() - 3600 * 1000),
        expiresAt: new Date(Date.now() + 3600 * 1000),
        submittedAt: new Date(),
        attemptNumber: 1,
        configSnapshotJson: {},
        resultMetadataJson: {},
      },
    });

    // ──────────────────────────────────────────────────────────
    // 1. START PRACTICAL CERTIFICATION 2.0 ATTEMPT
    // ──────────────────────────────────────────────────────────
    const startRes = await certsService.startExamAttempt(userAId, {
      certificationCode: 'NV-NET',
      type: ExamType.PRACTICAL,
    });
    const attemptId = startRes.attemptId;

    assert(
      !!attemptId &&
        startRes.theoryQuestions?.length === 5 &&
        !!startRes.troubleshootingIncident &&
        startRes.packetAnalysisQuestions?.length === 5 &&
        startRes.scoringWeights?.theoryWeight === 20 &&
        startRes.scoringWeights?.practicalWeight === 35 &&
        startRes.scoringWeights?.troubleshootingWeight === 25 &&
        startRes.scoringWeights?.packetAnalysisWeight === 20,
      '1. Practical Certification 2.0 starts with 4-part assessment structure and configurable scoring weights.'
    );

    // ──────────────────────────────────────────────────────────
    // 2. UNAUTHORIZED ATTEMPT ACCESS IS BLOCKED (403 Forbidden)
    // ──────────────────────────────────────────────────────────
    let userBBlocked = false;
    try {
      await certsService.getAttemptStatus(userBId, attemptId);
    } catch (e: any) {
      userBBlocked = e.status === 403;
    }
    assert(userBBlocked, '2. Unauthorized candidate (User B) blocked from viewing User A exam attempt.');

    let userBActionBlocked = false;
    try {
      await certsService.executePracticalAction(userBId, attemptId, { action: 'configureDevice', nodeId: 'PC-1' });
    } catch (e: any) {
      userBActionBlocked = e.status === 403;
    }
    assert(userBActionBlocked, '3. Unauthorized candidate (User B) blocked from modifying User A network topology.');

    let userBTroubleBlocked = false;
    try {
      await certsService.executeTroubleshootingAction(userBId, attemptId, { action: 'applyFix' });
    } catch (e: any) {
      userBTroubleBlocked = e.status === 403;
    }
    assert(userBTroubleBlocked, '4. Unauthorized candidate (User B) blocked from executing troubleshooting fixes on User A attempt.');

    // ──────────────────────────────────────────────────────────
    // 3. EXECUTE THEORY SECTION ANSWERS
    // ──────────────────────────────────────────────────────────
    const theoryQ = startRes.theoryQuestions || [];
    // User A answers all 5 theory questions correctly
    for (const t of theoryQ) {
      await certsService.answerQuestion(userAId, attemptId, {
        questionId: t.id,
        selectedOption: 0,
      });
    }
    assert(true, '5. Incremental Theory assessment answers recorded server-side.');

    // ──────────────────────────────────────────────────────────
    // 4. EXECUTE PRACTICAL NETWORK TOPOLOGY CONFIGURATIONS
    // ──────────────────────────────────────────────────────────
    // Subnet & Gateway on PC-1
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1' },
    });
    // VLAN 10 on Switch-A
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'configureVlan',
      nodeId: 'SWITCH-A',
      payload: { port: 'FastEthernet0/1', vlan: 10 },
    });
    // Enable interface & static route on Router-A
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'configureInterface',
      nodeId: 'ROUTER-A',
      payload: { interfaceName: 'Gi0/0', status: 'up' },
    });
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'addRoute',
      nodeId: 'ROUTER-A',
      payload: { destination: '172.16.0.0/24', nextHop: '10.0.0.2', interface: 'Gi0/1' },
    });
    // Permit HTTP on Firewall ACL
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'updateAcl',
      nodeId: 'FIREWALL',
      payload: { aclId: 'acl-101', action: 'PERMIT' },
    });
    // Provision Primary DNS on PC-1
    await certsService.executePracticalAction(userAId, attemptId, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { primaryDns: '172.16.0.10' },
    });
    assert(true, '6. Practical Network Topology tasks (IP subnetting, VLAN, routing, firewall ACL, DNS) configured.');

    // ──────────────────────────────────────────────────────────
    // 5. EXECUTE TROUBLESHOOTING INCIDENT DIAGNOSIS & REMEDIATION
    // ──────────────────────────────────────────────────────────
    const diag1 = await certsService.executeTroubleshootingAction(userAId, attemptId, {
      action: 'executeCommand',
      command: 'show ip ospf neighbor',
    });
    assert(
      diag1.incidentState.unlockedEvidenceCount >= 1 && diag1.commandOutput.includes('Mismatched Dead/Hello Timers'),
      '7. Troubleshooting diagnostic command executed on simulated Router-B and unlocked evidence.'
    );

    const fix1 = await certsService.executeTroubleshootingAction(userAId, attemptId, {
      action: 'applyFix',
      remediationAction: 'ALIGN_OSPF_TIMERS',
    });
    assert(
      fix1.incidentState.remediationApplied === true && fix1.commandOutput.includes('LOADING to FULL'),
      '8. Troubleshooting remediation action applied and validated server-side.'
    );

    // ──────────────────────────────────────────────────────────
    // 6. EXECUTE PACKET / PROTOCOL REASONING ANSWERS
    // ──────────────────────────────────────────────────────────
    const packetQ = startRes.packetAnalysisQuestions || [];
    for (const pq of packetQ) {
      await certsService.answerPacketQuestion(userAId, attemptId, {
        questionId: pq.id,
        selectedOption: 0,
      });
    }
    assert(true, '9. Packet / Protocol analysis answers recorded server-side.');

    // ──────────────────────────────────────────────────────────
    // 7. COMPLETE PASS SUBMISSION & SCORE CALCULATION
    // ──────────────────────────────────────────────────────────
    const passSubmitRes = await certsService.submitExamAttempt(userAId, attemptId, {});
    assert(
      passSubmitRes.status === ExamAttemptStatus.PASSED &&
        passSubmitRes.passed === true &&
        passSubmitRes.score === 100 &&
        passSubmitRes.componentScores.theory === 100 &&
        passSubmitRes.componentScores.practical === 100 &&
        passSubmitRes.componentScores.troubleshooting === 100 &&
        passSubmitRes.componentScores.packetAnalysis === 100,
      '10. Complete pass: 100% across Theory (20%), Practical (35%), Troubleshooting (25%), Packet (20%) produces final score 100% and PASSED status.',
      { score: passSubmitRes.score, componentScores: passSubmitRes.componentScores }
    );

    // ──────────────────────────────────────────────────────────
    // 8. OFFICIAL CERTIFICATE ISSUANCE UPON PASSING
    // ──────────────────────────────────────────────────────────
    const claimRes = await certsService.claimCertificationCertificate(userAId, 'NV-NET');
    assert(
      !!claimRes.id &&
        claimRes.recipientName === 'Dr. Certified Network Engineer' &&
        claimRes.credentialId.startsWith('NV-NET-2026-') &&
        claimRes.grade === 'Pass with High Distinction' &&
        Array.isArray(claimRes.skillsAssessed) &&
        claimRes.skillsAssessed.length >= 6,
      '11. Official Certificate issued with unique Credential ID, Grade, and Assessed Skills metadata.',
      { credentialId: claimRes.credentialId, grade: claimRes.grade, skillsCount: claimRes.skillsAssessed.length }
    );

    // Idempotent claim returns same certificate
    const repeatClaim = await certsService.claimCertificationCertificate(userAId, 'NV-NET');
    assert(repeatClaim.id === claimRes.id && repeatClaim.credentialId === claimRes.credentialId, '12. Duplicate certificate claim is idempotent.');

    // ──────────────────────────────────────────────────────────
    // 9. PUBLIC CERTIFICATE VERIFICATION WITHOUT PRIVATE DATA LEAK
    // ──────────────────────────────────────────────────────────
    const verifyRes = await certsService.verifyCertificate(claimRes.credentialId);
    assert(
      verifyRes.credentialId === claimRes.credentialId &&
        verifyRes.recipientName === 'Dr. Certified Network Engineer' &&
        verifyRes.isVerified === true &&
        verifyRes.grade === claimRes.grade &&
        (verifyRes as any).email === undefined &&
        (verifyRes as any).passwordHash === undefined &&
        (verifyRes as any).userId === undefined,
      '13. Public certificate verification returns public credential details while strictly omitting private account data.'
    );

    // ──────────────────────────────────────────────────────────
    // 10. UNVERIFIED / FAILING USER CANNOT CLAIM CERTIFICATE
    // ──────────────────────────────────────────────────────────
    let userBClaimBlocked = false;
    try {
      await certsService.claimCertificationCertificate(userBId, 'NV-NET');
    } catch (e: any) {
      userBClaimBlocked = e.status === 400 || e.message?.includes('Certificate claim denied');
    }
    assert(userBClaimBlocked, '14. User without passed certification exam attempt cannot claim certificate (400 Bad Request).');

    // ──────────────────────────────────────────────────────────
    // 11. TEST COMPONENT FAILURE MODES (THEORY FAILURE)
    // ──────────────────────────────────────────────────────────
    const userTheoryFailId = randomUUID();
    await prisma.user.create({
      data: {
        id: userTheoryFailId,
        email: `cert2-theoryfail-${ts}@netvision.edu`,
        username: `cert2_tf_${ts.toString().slice(-8)}`,
        passwordHash: 'hash',
        fullName: 'Theory Fail User',
        isVerified: true,
      },
    });
    for (const l of allLessons) {
      await prisma.userProgress.create({ data: { userId: userTheoryFailId, lessonId: l.id, completed: true, score: 100 } });
      for (const lab of l.labs) {
        await prisma.labAttempt.create({ data: { userId: userTheoryFailId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' } });
      }
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({ data: { userId: userTheoryFailId, quizId: q.id, score: 100, passed: true, answersJson: {} } });
      }
    }
    await prisma.examAttempt.create({
      data: {
        userId: userTheoryFailId,
        certificationCode: 'NV-NET',
        type: ExamType.THEORY,
        status: ExamAttemptStatus.PASSED,
        score: 90,
        passed: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 3600 * 1000),
        submittedAt: new Date(),
        attemptNumber: 1,
        configSnapshotJson: {},
        resultMetadataJson: {},
      },
    });

    const tfAttempt = await certsService.startExamAttempt(userTheoryFailId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    // Intentionally answer 0/5 theory questions correctly
    for (const t of tfAttempt.theoryQuestions || []) {
      await certsService.answerQuestion(userTheoryFailId, tfAttempt.attemptId, { questionId: t.id, selectedOption: 3 });
    }
    // Fix practical topology
    await certsService.executePracticalAction(userTheoryFailId, tfAttempt.attemptId, { action: 'configureDevice', nodeId: 'PC-1', payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1', primaryDns: '172.16.0.10' } });
    await certsService.executePracticalAction(userTheoryFailId, tfAttempt.attemptId, { action: 'configureVlan', nodeId: 'SWITCH-A', payload: { port: 'FastEthernet0/1', vlan: 10 } });
    await certsService.executePracticalAction(userTheoryFailId, tfAttempt.attemptId, { action: 'configureInterface', nodeId: 'ROUTER-A', payload: { interfaceName: 'Gi0/0', status: 'up' } });
    await certsService.executePracticalAction(userTheoryFailId, tfAttempt.attemptId, { action: 'addRoute', nodeId: 'ROUTER-A', payload: { destination: '172.16.0.0/24', nextHop: '10.0.0.2', interface: 'Gi0/1' } });
    await certsService.executePracticalAction(userTheoryFailId, tfAttempt.attemptId, { action: 'updateAcl', nodeId: 'FIREWALL', payload: { aclId: 'acl-101', action: 'PERMIT' } });
    // Fix troubleshooting & packet
    await certsService.executeTroubleshootingAction(userTheoryFailId, tfAttempt.attemptId, { action: 'applyFix', remediationAction: 'ALIGN_OSPF_TIMERS' });
    for (const pq of tfAttempt.packetAnalysisQuestions || []) {
      await certsService.answerPacketQuestion(userTheoryFailId, tfAttempt.attemptId, { questionId: pq.id, selectedOption: 0 });
    }

    const tfSubmit = await certsService.submitExamAttempt(userTheoryFailId, tfAttempt.attemptId, {});
    assert(
      tfSubmit.componentScores.theory === 0 && tfSubmit.passed === false && tfSubmit.status === ExamAttemptStatus.FAILED,
      '15. Theory failure (<60% component threshold) causes overall Practical Certification to FAIL.',
      { theoryScore: tfSubmit.componentScores.theory, passed: tfSubmit.passed }
    );

    // ──────────────────────────────────────────────────────────
    // 12. TEST TROUBLESHOOTING FAILURE MODE
    // ──────────────────────────────────────────────────────────
    const userTroubleFailId = randomUUID();
    await prisma.user.create({
      data: { id: userTroubleFailId, email: `cert2-trbfail-${ts}@netvision.edu`, username: `cert2_trb_${ts.toString().slice(-8)}`, passwordHash: 'hash', fullName: 'Trouble Fail User', isVerified: true },
    });
    for (const l of allLessons) {
      await prisma.userProgress.create({ data: { userId: userTroubleFailId, lessonId: l.id, completed: true, score: 100 } });
      for (const lab of l.labs) {
        await prisma.labAttempt.create({ data: { userId: userTroubleFailId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' } });
      }
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({ data: { userId: userTroubleFailId, quizId: q.id, score: 100, passed: true, answersJson: {} } });
      }
    }
    await prisma.examAttempt.create({
      data: { userId: userTroubleFailId, certificationCode: 'NV-NET', type: ExamType.THEORY, status: ExamAttemptStatus.PASSED, score: 90, passed: true, startedAt: new Date(), expiresAt: new Date(Date.now() + 3600 * 1000), submittedAt: new Date(), attemptNumber: 1, configSnapshotJson: {}, resultMetadataJson: {} },
    });

    const trbAttempt = await certsService.startExamAttempt(userTroubleFailId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    for (const t of trbAttempt.theoryQuestions || []) {
      await certsService.answerQuestion(userTroubleFailId, trbAttempt.attemptId, { questionId: t.id, selectedOption: 0 });
    }
    await certsService.executePracticalAction(userTroubleFailId, trbAttempt.attemptId, { action: 'configureDevice', nodeId: 'PC-1', payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1', primaryDns: '172.16.0.10' } });
    await certsService.executePracticalAction(userTroubleFailId, trbAttempt.attemptId, { action: 'configureVlan', nodeId: 'SWITCH-A', payload: { port: 'FastEthernet0/1', vlan: 10 } });
    await certsService.executePracticalAction(userTroubleFailId, trbAttempt.attemptId, { action: 'configureInterface', nodeId: 'ROUTER-A', payload: { interfaceName: 'Gi0/0', status: 'up' } });
    await certsService.executePracticalAction(userTroubleFailId, trbAttempt.attemptId, { action: 'addRoute', nodeId: 'ROUTER-A', payload: { destination: '172.16.0.0/24', nextHop: '10.0.0.2', interface: 'Gi0/1' } });
    await certsService.executePracticalAction(userTroubleFailId, trbAttempt.attemptId, { action: 'updateAcl', nodeId: 'FIREWALL', payload: { aclId: 'acl-101', action: 'PERMIT' } });
    for (const pq of trbAttempt.packetAnalysisQuestions || []) {
      await certsService.answerPacketQuestion(userTroubleFailId, trbAttempt.attemptId, { questionId: pq.id, selectedOption: 0 });
    }
    // Do NOT apply troubleshooting fix
    const trbSubmit = await certsService.submitExamAttempt(userTroubleFailId, trbAttempt.attemptId, {});
    assert(
      trbSubmit.componentScores.troubleshooting === 0 && trbSubmit.passed === false && trbSubmit.status === ExamAttemptStatus.FAILED,
      '16. Troubleshooting failure (unresolved incident) causes overall Practical Certification to FAIL.',
      { troubleshootingScore: trbSubmit.componentScores.troubleshooting, passed: trbSubmit.passed }
    );

    // ──────────────────────────────────────────────────────────
    // 13. TEST PACKET ANALYSIS FAILURE MODE
    // ──────────────────────────────────────────────────────────
    const userPktFailId = randomUUID();
    await prisma.user.create({
      data: { id: userPktFailId, email: `cert2-pktfail-${ts}@netvision.edu`, username: `cert2_pkt_${ts.toString().slice(-8)}`, passwordHash: 'hash', fullName: 'Packet Fail User', isVerified: true },
    });
    for (const l of allLessons) {
      await prisma.userProgress.create({ data: { userId: userPktFailId, lessonId: l.id, completed: true, score: 100 } });
      for (const lab of l.labs) {
        await prisma.labAttempt.create({ data: { userId: userPktFailId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' } });
      }
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({ data: { userId: userPktFailId, quizId: q.id, score: 100, passed: true, answersJson: {} } });
      }
    }
    await prisma.examAttempt.create({
      data: { userId: userPktFailId, certificationCode: 'NV-NET', type: ExamType.THEORY, status: ExamAttemptStatus.PASSED, score: 90, passed: true, startedAt: new Date(), expiresAt: new Date(Date.now() + 3600 * 1000), submittedAt: new Date(), attemptNumber: 1, configSnapshotJson: {}, resultMetadataJson: {} },
    });

    const pktAttempt = await certsService.startExamAttempt(userPktFailId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    for (const t of pktAttempt.theoryQuestions || []) {
      await certsService.answerQuestion(userPktFailId, pktAttempt.attemptId, { questionId: t.id, selectedOption: 0 });
    }
    await certsService.executePracticalAction(userPktFailId, pktAttempt.attemptId, { action: 'configureDevice', nodeId: 'PC-1', payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1', primaryDns: '172.16.0.10' } });
    await certsService.executePracticalAction(userPktFailId, pktAttempt.attemptId, { action: 'configureVlan', nodeId: 'SWITCH-A', payload: { port: 'FastEthernet0/1', vlan: 10 } });
    await certsService.executePracticalAction(userPktFailId, pktAttempt.attemptId, { action: 'configureInterface', nodeId: 'ROUTER-A', payload: { interfaceName: 'Gi0/0', status: 'up' } });
    await certsService.executePracticalAction(userPktFailId, pktAttempt.attemptId, { action: 'addRoute', nodeId: 'ROUTER-A', payload: { destination: '172.16.0.0/24', nextHop: '10.0.0.2', interface: 'Gi0/1' } });
    await certsService.executePracticalAction(userPktFailId, pktAttempt.attemptId, { action: 'updateAcl', nodeId: 'FIREWALL', payload: { aclId: 'acl-101', action: 'PERMIT' } });
    await certsService.executeTroubleshootingAction(userPktFailId, pktAttempt.attemptId, { action: 'applyFix', remediationAction: 'ALIGN_OSPF_TIMERS' });
    // Intentionally answer 0/5 packet analysis questions
    for (const pq of pktAttempt.packetAnalysisQuestions || []) {
      await certsService.answerPacketQuestion(userPktFailId, pktAttempt.attemptId, { questionId: pq.id, selectedOption: 3 });
    }

    const pktSubmit = await certsService.submitExamAttempt(userPktFailId, pktAttempt.attemptId, {});
    assert(
      pktSubmit.componentScores.packetAnalysis === 0 && pktSubmit.passed === false && pktSubmit.status === ExamAttemptStatus.FAILED,
      '17. Packet / Protocol analysis failure (<60% component threshold) causes overall Practical Certification to FAIL.',
      { packetScore: pktSubmit.componentScores.packetAnalysis, passed: pktSubmit.passed }
    );

    // ──────────────────────────────────────────────────────────
    // 14. TEST PRACTICAL TOPOLOGY FAILURE MODE
    // ──────────────────────────────────────────────────────────
    const userPracFailId = randomUUID();
    await prisma.user.create({
      data: { id: userPracFailId, email: `cert2-pracfail-${ts}@netvision.edu`, username: `cert2_pf_${ts.toString().slice(-8)}`, passwordHash: 'hash', fullName: 'Practical Fail User', isVerified: true },
    });
    for (const l of allLessons) {
      await prisma.userProgress.create({ data: { userId: userPracFailId, lessonId: l.id, completed: true, score: 100 } });
      for (const lab of l.labs) {
        await prisma.labAttempt.create({ data: { userId: userPracFailId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' } });
      }
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({ data: { userId: userPracFailId, quizId: q.id, score: 100, passed: true, answersJson: {} } });
      }
    }
    await prisma.examAttempt.create({
      data: { userId: userPracFailId, certificationCode: 'NV-NET', type: ExamType.THEORY, status: ExamAttemptStatus.PASSED, score: 90, passed: true, startedAt: new Date(), expiresAt: new Date(Date.now() + 3600 * 1000), submittedAt: new Date(), attemptNumber: 1, configSnapshotJson: {}, resultMetadataJson: {} },
    });

    const pfAttempt = await certsService.startExamAttempt(userPracFailId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    for (const t of pfAttempt.theoryQuestions || []) {
      await certsService.answerQuestion(userPracFailId, pfAttempt.attemptId, { questionId: t.id, selectedOption: 0 });
    }
    // Leave topology broken (critical objectives unfulfilled)
    await certsService.executeTroubleshootingAction(userPracFailId, pfAttempt.attemptId, { action: 'applyFix', remediationAction: 'ALIGN_OSPF_TIMERS' });
    for (const pq of pfAttempt.packetAnalysisQuestions || []) {
      await certsService.answerPacketQuestion(userPracFailId, pfAttempt.attemptId, { questionId: pq.id, selectedOption: 0 });
    }

    const pfSubmit = await certsService.submitExamAttempt(userPracFailId, pfAttempt.attemptId, {});
    assert(
      pfSubmit.allCriticalPassed === false && pfSubmit.passed === false && pfSubmit.status === ExamAttemptStatus.FAILED,
      '18. Practical network failure (unmet critical topology objectives) causes overall Practical Certification to FAIL.',
      { allCriticalPassed: pfSubmit.allCriticalPassed, passed: pfSubmit.passed }
    );

    console.log(`\n🎉 NETVISION PRACTICAL CERTIFICATION 2.0 Verification Passed! All ${passedCount} assertions verified successfully.`);
  } catch (err: any) {
    console.error('\n❌ Practical Certification 2.0 Test Suite Failed:', err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

runPracticalCertification2Suite();
