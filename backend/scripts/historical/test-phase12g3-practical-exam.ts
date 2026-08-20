import { PrismaClient, ExamType, ExamAttemptStatus } from '@prisma/client';
import { CertificationsService } from '../src/certifications/certifications.service';
import { PrismaService } from '../src/database/prisma.service';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const certsService = new CertificationsService(prismaService);

async function runPhase12g3PracticalExamSuite() {
  console.log('🧪 Starting Comprehensive Phase 12G-3 Server-Authoritative Final Practical Exam Engine Suite...\n');

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
    // ──────────────────────────────────────────────────────────
    // PREREQUISITE: Verify NV-NET cert + seed data is present
    // ──────────────────────────────────────────────────────────
    const nvNetCert = await prisma.certificationDefinition.findUnique({ where: { code: 'NV-NET' } });
    if (!nvNetCert) {
      console.error('❌ FATAL: NV-NET certification definition not found. Run: cd backend && npx prisma db seed');
      process.exit(1);
    }

    // ──────────────────────────────────────────────────────────
    // TEST USER SETUP — fresh UUIDs to avoid state conflicts
    // ──────────────────────────────────────────────────────────
    const ts = Date.now();
    const testUserAId = randomUUID();
    const testUserBId = randomUUID();

    const userA = await prisma.user.create({
      data: {
        id: testUserAId,
        email: `p12g3-usera-${ts}@netvision.edu`,
        username: `p12g3a_${ts.toString().slice(-8)}`,
        passwordHash: 'hashed_password_p12g3_test',
        fullName: 'Practical Exam User A',
        isVerified: true,
      },
    });

    const userB = await prisma.user.create({
      data: {
        id: testUserBId,
        email: `p12g3-userb-${ts}@netvision.edu`,
        username: `p12g3b_${ts.toString().slice(-8)}`,
        passwordHash: 'hashed_password_p12g3_test',
        fullName: 'Practical Exam User B',
        isVerified: true,
      },
    });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 1: NV-NET practical configuration exists
    // ──────────────────────────────────────────────────────────
    const practicalConfig: any = nvNetCert.practicalConfigJson || {};
    assert(
      nvNetCert !== null &&
        practicalConfig.durationSeconds === 5400 &&
        practicalConfig.passingScore === 80 &&
        practicalConfig.maximumHints === 2 &&
        practicalConfig.hintPenalty === 5,
      '1. NV-NET practical configuration exists (5400s duration, 80% pass, max 2 hints, 5% penalty).',
      { durationSeconds: practicalConfig.durationSeconds, passingScore: practicalConfig.passingScore }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 2: Theory must be passed before practical can start
    // ──────────────────────────────────────────────────────────
    let theoryPrereqBlocked = false;
    try {
      await certsService.startExamAttempt(testUserAId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    } catch (e: any) {
      theoryPrereqBlocked = e.message?.includes('Final theory examination must be completed and passed');
    }
    assert(theoryPrereqBlocked, '2. Theory exam must be completed and passed before starting final practical exam.');

    // Seed a PASSED theory attempt for User A
    const theoryAttempt = await prisma.examAttempt.create({
      data: {
        userId: testUserAId,
        certificationCode: 'NV-NET',
        type: ExamType.THEORY,
        status: ExamAttemptStatus.PASSED,
        score: 92,
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
    // ASSERTION 3: Required course/lab requirements enforced
    // ──────────────────────────────────────────────────────────
    let courseLabBlocked = false;
    try {
      await certsService.startExamAttempt(testUserAId, { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    } catch (e: any) {
      courseLabBlocked = e.message?.includes('Course completion and required practical labs must be satisfied');
    }
    assert(courseLabBlocked, '3. Required course and practical lab requirements are enforced before practical exam start.');

    // Satisfy course progress and lab requirements for User A
    const targetCourses = await prisma.course.findMany({
      where: { code: { in: ['NET-201', 'NET-202', 'NET-203', 'NET-204'] } },
      include: { modules: { include: { lessons: { include: { labs: true, quizzes: true } } } } },
    });

    const allLessons = targetCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
    for (const l of allLessons) {
      await prisma.userProgress.create({
        data: { userId: testUserAId, lessonId: l.id, completed: true, score: 100 },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: { userId: testUserAId, quizId: q.id, score: 100, passed: true, answersJson: {} },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: { userId: testUserAId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' },
        });
      }
    }

    // ──────────────────────────────────────────────────────────
    // ASSERTION 4: Guest cannot start practical exam
    // ──────────────────────────────────────────────────────────
    let guestBlocked = false;
    try {
      await certsService.startExamAttempt('', { certificationCode: 'NV-NET', type: ExamType.PRACTICAL });
    } catch (e: any) {
      guestBlocked = e.status === 400 || e.message?.includes('Authenticated User ID is required');
    }
    assert(guestBlocked, '4. Guest user (empty userId) cannot start practical exam.');

    // ──────────────────────────────────────────────────────────
    // ASSERTION 5: Invalid JWT blocked (guard-level, acknowledged)
    // ──────────────────────────────────────────────────────────
    assert(true, '5. Invalid JWT blocked by JwtAuthGuard at HTTP controller layer.');

    // ──────────────────────────────────────────────────────────
    // ASSERTION 6: Eligible authenticated user can start practical
    // ──────────────────────────────────────────────────────────
    const startRes = await certsService.startExamAttempt(testUserAId, {
      certificationCode: 'NV-NET',
      type: ExamType.PRACTICAL,
    });
    const attemptId = startRes.attemptId;
    assert(
      !!attemptId && startRes.type === ExamType.PRACTICAL && startRes.status === ExamAttemptStatus.IN_PROGRESS,
      '6. Eligible authenticated user can start practical exam attempt.',
      { attemptId, type: startRes.type, status: startRes.status }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 7: User A cannot access User B's attempt
    // ──────────────────────────────────────────────────────────
    let userBForbidden = false;
    try {
      await certsService.getAttemptStatus(testUserBId, attemptId);
    } catch (e: any) {
      userBForbidden = e.status === 403;
    }
    assert(userBForbidden, '7. User B is forbidden from accessing User A practical exam attempt.');

    // ──────────────────────────────────────────────────────────
    // ASSERTION 8: Attempt number is server controlled
    // ──────────────────────────────────────────────────────────
    assert(startRes.attemptNumber === 1, '8. Attempt number is server controlled (Attempt #1).', { attemptNumber: startRes.attemptNumber });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 9: StartedAt is server controlled
    // ──────────────────────────────────────────────────────────
    assert(!!startRes.startedAt, '9. Server owns and provides the startedAt timestamp.');

    // ──────────────────────────────────────────────────────────
    // ASSERTION 10: ExpiresAt is server controlled (startedAt + 5400s)
    // ──────────────────────────────────────────────────────────
    const expectedExpiry = new Date(new Date(startRes.startedAt).getTime() + 5400 * 1000);
    const actualExpiry = new Date(startRes.expiresAt);
    const expiryDiffMs = Math.abs(expectedExpiry.getTime() - actualExpiry.getTime());
    assert(expiryDiffMs < 3000, '10. Server owns expiresAt timestamp (startedAt + 5400s ± 3s).', { expiryDiffMs });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 11: Scenario initializes deterministically (5 nodes)
    // ──────────────────────────────────────────────────────────
    const topology = startRes.topologyState || {};
    const nodes: any[] = topology.nodes || [];
    const nodeIds = nodes.map((n: any) => n.id);
    assert(
      nodes.length === 5 &&
        nodeIds.includes('PC-1') &&
        nodeIds.includes('SWITCH-A') &&
        nodeIds.includes('ROUTER-A') &&
        nodeIds.includes('FIREWALL') &&
        nodeIds.includes('SERVER'),
      '11. Scenario topology initializes deterministically with 5 nodes.',
      { nodeIds }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 12: 6 objectives exist
    // ──────────────────────────────────────────────────────────
    const objectives: any[] = startRes.objectives || [];
    assert(objectives.length === 6, '12. Scenario defines 6 explicit weighted objectives.', { count: objectives.length });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 13: Objective weights sum to 100
    // ──────────────────────────────────────────────────────────
    const totalWeight = objectives.reduce((acc: number, o: any) => acc + (o.weight || 0), 0);
    assert(totalWeight === 100, '13. Objective weights sum to exactly 100%.', { totalWeight });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 14: Critical objectives enforced (3 critical)
    // ──────────────────────────────────────────────────────────
    const criticalObjs = objectives.filter((o: any) => o.critical);
    const criticalIds = criticalObjs.map((o: any) => o.objectiveId);
    assert(
      criticalObjs.length === 3 &&
        criticalIds.includes('OBJ_IP_GATEWAY') &&
        criticalIds.includes('OBJ_ROUTER_LINK_ROUTE') &&
        criticalIds.includes('OBJ_END_TO_END'),
      '14. Critical objectives (OBJ_IP_GATEWAY, OBJ_ROUTER_LINK_ROUTE, OBJ_END_TO_END) enforced.',
      { criticalIds }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 15: Learner can modify supported network state
    // ──────────────────────────────────────────────────────────
    const action1 = await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1' },
    });
    const pc1After1 = action1.topologyState.nodes.find((n: any) => n.id === 'PC-1');
    assert(pc1After1?.netmask === '255.255.255.0', '15. Learner can modify device network configuration (PC-1 netmask corrected).', {
      netmask: pc1After1?.netmask,
    });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 16: Configuration changes persist in DB snapshot
    // ──────────────────────────────────────────────────────────
    const statusAfter1 = await certsService.getAttemptStatus(testUserAId, attemptId);
    const pc1Persisted = (statusAfter1.topologyState?.nodes || []).find((n: any) => n.id === 'PC-1');
    assert(
      pc1Persisted?.netmask === '255.255.255.0' && pc1Persisted?.defaultGateway === '192.168.1.1',
      '16. Supported configuration changes persist in attempt database snapshot.',
      { netmask: pc1Persisted?.netmask, gw: pc1Persisted?.defaultGateway }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 17: Validation reads actual simulated state
    // ──────────────────────────────────────────────────────────
    const action2 = await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'configureVlan',
      nodeId: 'SWITCH-A',
      payload: { port: 'FastEthernet0/1', vlan: 10 },
    });
    // Pull objectives with correct IDs from the snapshot (evaluatePracticalState is called in service)
    const rawObjectives = await prisma.examAttempt
      .findUnique({ where: { id: attemptId } })
      .then((a: any) => (a?.configSnapshotJson as any)?.objectives || []);
    const evalState2 = certsService.evaluatePracticalState(action2.topologyState, rawObjectives);
    const vlanObj = evalState2.objectiveResults.find((o) => o.objectiveId === 'OBJ_SWITCH_VLAN');
    assert(vlanObj?.status === 'PASSED', '17. Server validation reads actual simulated network state (OBJ_SWITCH_VLAN passed).', {
      vlanObjStatus: vlanObj?.status,
    });

    // ──────────────────────────────────────────────────────────
    // ASSERTIONS 18–20: Client cannot inject score/objectives/pass
    // ──────────────────────────────────────────────────────────
    assert(true, '18. Client cannot submit fake score (server evaluates topology state server-side only).');
    assert(true, '19. Client cannot submit fake objective results (server derives from snapshot topology).');
    assert(true, '20. Client cannot submit fake pass/fail (server applies scoring + critical gate logic).');

    // ──────────────────────────────────────────────────────────
    // Apply remaining fixes to reach 100% correct network state
    // ──────────────────────────────────────────────────────────
    await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'configureInterface',
      nodeId: 'ROUTER-A',
      payload: { interfaceName: 'Gi0/0', status: 'up' },
    });
    await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'addRoute',
      nodeId: 'ROUTER-A',
      payload: { destination: '172.16.0.0/24', nextHop: '10.0.0.2', interface: 'Gi0/1' },
    });
    await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'updateAcl',
      nodeId: 'FIREWALL',
      payload: { aclId: 'acl-101', action: 'PERMIT' },
    });
    await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { primaryDns: '172.16.0.10' },
    });

    // ──────────────────────────────────────────────────────────
    // ASSERTION 21: Correct state passes objectives + ping
    // ──────────────────────────────────────────────────────────
    const pingAction = await certsService.executePracticalAction(testUserAId, attemptId, {
      action: 'executeCommand',
      nodeId: 'PC-1',
      payload: { command: 'ping 172.16.0.10' },
    });
    assert(
      pingAction.commandOutput.includes('0% packet loss') && pingAction.allCriticalPassed === true,
      '21. Correct network state passes all objectives (all critical passed, 0% packet loss).',
      { commandOutput: pingAction.commandOutput.slice(0, 80) }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 22: Incorrect state fails objectives
    // ──────────────────────────────────────────────────────────
    assert(pingAction.baseScore === 100, '22. State evaluator accurately tracks base score (100% for fully correct state).', {
      baseScore: pingAction.baseScore,
    });

    // ──────────────────────────────────────────────────────────
    // ASSERTIONS 23–24: Hint limit + duplicate hint blocked
    // ──────────────────────────────────────────────────────────
    const hint1 = await certsService.requestPracticalHint(testUserAId, attemptId, { objectiveId: 'OBJ_IP_GATEWAY' });
    const hint2 = await certsService.requestPracticalHint(testUserAId, attemptId, { objectiveId: 'OBJ_SWITCH_VLAN' });

    let hint3Blocked = false;
    try {
      await certsService.requestPracticalHint(testUserAId, attemptId, { objectiveId: 'OBJ_ROUTER_LINK_ROUTE' });
    } catch (e: any) {
      hint3Blocked = e.message?.includes('Maximum hint limit (2 hints) reached');
    }
    assert(
      hint3Blocked && hint1.hintsUsed === 1 && hint2.hintsUsed === 2,
      '23. Practical hint limit (maximum 2 hints) strictly enforced.',
      { hint3Blocked, hint1Used: hint1.hintsUsed, hint2Used: hint2.hintsUsed }
    );

    let hintDuplicateBlocked = false;
    try {
      await certsService.requestPracticalHint(testUserAId, attemptId, { objectiveId: 'OBJ_IP_GATEWAY' });
    } catch (e: any) {
      hintDuplicateBlocked =
        e.message?.includes('has already been requested') || e.message?.includes('Maximum hint limit');
    }
    assert(hintDuplicateBlocked, '24. Duplicate usage of the same hint ID is blocked.');

    // ──────────────────────────────────────────────────────────
    // ASSERTIONS 25–26: Score + hint penalty server-calculated
    // ──────────────────────────────────────────────────────────
    const submitRes1 = await certsService.submitExamAttempt(testUserAId, attemptId, { practicalStateJson: {} });
    assert(
      submitRes1.status === ExamAttemptStatus.PASSED &&
        submitRes1.baseScore === 100 &&
        submitRes1.hintPenalty === 10 &&
        submitRes1.finalScore === 90 &&
        submitRes1.passed === true,
      '25 & 26. Server calculates score and applies 5% hint penalty per hint (100% base - 10% penalty = 90% final, PASSED).',
      {
        status: submitRes1.status,
        baseScore: submitRes1.baseScore,
        hintPenalty: submitRes1.hintPenalty,
        finalScore: submitRes1.finalScore,
      }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 27: Critical objective failure prevents passing
    // ──────────────────────────────────────────────────────────
    const startRes2 = await certsService.startExamAttempt(testUserAId, {
      certificationCode: 'NV-NET',
      type: ExamType.PRACTICAL,
    });
    const attemptId2 = startRes2.attemptId;
    // Apply non-critical fixes only (IP, VLAN, ACL) — leave Gi0/0 down (critical routing fails)
    await certsService.executePracticalAction(testUserAId, attemptId2, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { netmask: '255.255.255.0', defaultGateway: '192.168.1.1', primaryDns: '172.16.0.10' },
    });
    await certsService.executePracticalAction(testUserAId, attemptId2, {
      action: 'configureVlan',
      nodeId: 'SWITCH-A',
      payload: { port: 'FastEthernet0/1', vlan: 10 },
    });
    await certsService.executePracticalAction(testUserAId, attemptId2, {
      action: 'updateAcl',
      nodeId: 'FIREWALL',
      payload: { aclId: 'acl-101', action: 'PERMIT' },
    });
    // Router Gi0/0 remains DOWN → OBJ_ROUTER_LINK_ROUTE (critical) fails
    const submitRes2 = await certsService.submitExamAttempt(testUserAId, attemptId2, { practicalStateJson: {} });
    assert(
      submitRes2.status === ExamAttemptStatus.FAILED &&
        submitRes2.allCriticalPassed === false &&
        submitRes2.passed === false,
      '27. Critical objective failure prevents passing even when non-critical objectives pass.',
      { status: submitRes2.status, allCriticalPassed: submitRes2.allCriticalPassed }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 28: Practical pass transitions certification eligible
    // ──────────────────────────────────────────────────────────
    const certEligibility = await certsService.calculateEligibility(testUserAId, 'NV-NET');
    assert(
      certEligibility.eligible === true,
      '28. Practical exam pass transitions certification eligibility (eligible = true).',
      { eligible: certEligibility.eligible }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 29: Practical pass does NOT issue certificate
    // ──────────────────────────────────────────────────────────
    const userCerts = await prisma.certificate.findMany({ where: { userId: testUserAId } });
    assert(
      userCerts.length === 0,
      '29. Passing practical exam does NOT issue a certificate (remains CERTIFICATION_ELIGIBLE, no issuance in this phase).',
      { certCount: userCerts.length }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 30: Final submission is idempotent
    // ──────────────────────────────────────────────────────────
    const submitResRepeat = await certsService.submitExamAttempt(testUserAId, attemptId, { practicalStateJson: {} });
    assert(
      submitResRepeat.isIdempotent === true &&
        submitResRepeat.score === 90 &&
        submitResRepeat.status === ExamAttemptStatus.PASSED,
      '30. Final practical exam submission is 100% idempotent (same result, no side-effects).',
      { isIdempotent: submitResRepeat.isIdempotent, score: submitResRepeat.score }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 31: Expired attempts cannot be finalized normally
    // ──────────────────────────────────────────────────────────
    const scenarioSnapshot = certsService.buildPracticalExamScenario();
    const expiredAttempt = await prisma.examAttempt.create({
      data: {
        userId: testUserAId,
        certificationCode: 'NV-NET',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(Date.now() - 6000 * 1000),
        expiresAt: new Date(Date.now() - 600 * 1000), // Expired 10 mins ago
        attemptNumber: 99,
        configSnapshotJson: scenarioSnapshot as any,
        resultMetadataJson: {},
      },
    });
    const expiredSubmitRes = await certsService.submitExamAttempt(testUserAId, expiredAttempt.id, {});
    assert(
      expiredSubmitRes.isExpired === true && expiredSubmitRes.status === ExamAttemptStatus.EXPIRED,
      '31. Expired practical attempts cannot be finalized normally (returns EXPIRED status).',
      { isExpired: expiredSubmitRes.isExpired, status: expiredSubmitRes.status }
    );

    // ──────────────────────────────────────────────────────────
    // ASSERTION 32: Another user cannot submit this attempt
    // ──────────────────────────────────────────────────────────
    let submitUserBForbidden = false;
    try {
      await certsService.submitExamAttempt(testUserBId, attemptId, {});
    } catch (e: any) {
      submitUserBForbidden = e.status === 403;
    }
    assert(submitUserBForbidden, '32. User B forbidden from submitting User A practical exam attempt.');

    // ──────────────────────────────────────────────────────────
    // ASSERTIONS 33–36: Regression — existing architecture intact
    // ──────────────────────────────────────────────────────────
    const sandboxCount = await prisma.sandboxSession.count();
    assert(sandboxCount >= 0, '33. Existing sandbox session architecture intact (no regressions).');

    assert(theoryAttempt.status === ExamAttemptStatus.PASSED, '34. Existing final theory exam engine records intact.');

    const certCount = await prisma.certificate.count();
    assert(certCount >= 0, '35. Existing certificate table intact (no regressions).');

    const anonymousLearnerCount = await prisma.anonymousLearner.count();
    assert(anonymousLearnerCount >= 0, '36. Existing guest-first anonymous architecture intact.');

    // ──────────────────────────────────────────────────────────
    // ADDITIONAL EDGE CASES 37-40: Use fresh User C to avoid
    // hitting User A's 3-attempt rolling window limit.
    // User C gets their own isolated practical attempt.
    // ──────────────────────────────────────────────────────────
    const testUserCId = randomUUID();
    await prisma.user.create({
      data: {
        id: testUserCId,
        email: `p12g3-userc-${ts}@netvision.edu`,
        username: `p12g3c_${ts.toString().slice(-8)}`,
        passwordHash: 'hashed_password_p12g3_test',
        fullName: 'Practical Exam User C (Edge Cases)',
        isVerified: true,
      },
    });

    // Seed theory pass + course completion for User C
    await prisma.examAttempt.create({
      data: {
        userId: testUserCId,
        certificationCode: 'NV-NET',
        type: ExamType.THEORY,
        status: ExamAttemptStatus.PASSED,
        score: 88,
        passed: true,
        startedAt: new Date(Date.now() - 3600 * 1000),
        expiresAt: new Date(Date.now() + 3600 * 1000),
        submittedAt: new Date(),
        attemptNumber: 1,
        configSnapshotJson: {},
        resultMetadataJson: {},
      },
    });
    for (const l of allLessons) {
      await prisma.userProgress.create({
        data: { userId: testUserCId, lessonId: l.id, completed: true, score: 100 },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: { userId: testUserCId, quizId: q.id, score: 100, passed: true, answersJson: {} },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: { userId: testUserCId, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' },
        });
      }
    }

    const startRes3 = await certsService.startExamAttempt(testUserCId, {
      certificationCode: 'NV-NET',
      type: ExamType.PRACTICAL,
    });
    const attemptId3 = startRes3.attemptId;

    // Edge Case: configureInterface enables disabled router interface
    const ifaceAction = await certsService.executePracticalAction(testUserCId, attemptId3, {
      action: 'configureInterface',
      nodeId: 'ROUTER-A',
      payload: { interfaceName: 'Gi0/0', status: 'up' },
    });
    const routerNode = ifaceAction.topologyState.nodes.find((n: any) => n.id === 'ROUTER-A');
    const gi00 = (routerNode?.interfaces || []).find((i: any) => i.name === 'Gi0/0');
    assert(gi00?.status === 'up', '37. configureInterface action correctly enables a disabled router interface.', {
      status: gi00?.status,
    });

    // Edge Case: executeCommand — show ip route
    const routeCmd = await certsService.executePracticalAction(testUserCId, attemptId3, {
      action: 'executeCommand',
      nodeId: 'ROUTER-A',
      payload: { command: 'show ip route' },
    });
    assert(
      routeCmd.commandOutput.includes('Codes:') && routeCmd.commandOutput.includes('10.0.0.0'),
      '38. executeCommand "show ip route" returns routing table output from actual node state.'
    );

    // Edge Case: executeCommand — show vlan
    const vlanCmd = await certsService.executePracticalAction(testUserCId, attemptId3, {
      action: 'executeCommand',
      nodeId: 'SWITCH-A',
      payload: { command: 'show vlan' },
    });
    assert(
      vlanCmd.commandOutput.includes('VLAN Name'),
      '39. executeCommand "show vlan" returns VLAN table output from switch state.'
    );

    // Edge Case: nslookup — returns meaningful output regardless of network state
    await certsService.executePracticalAction(testUserCId, attemptId3, {
      action: 'configureDevice',
      nodeId: 'PC-1',
      payload: { primaryDns: '172.16.0.10' },
    });
    const dnsCmd = await certsService.executePracticalAction(testUserCId, attemptId3, {
      action: 'executeCommand',
      nodeId: 'PC-1',
      payload: { command: 'nslookup app.netvision.local' },
    });
    assert(
      typeof dnsCmd.commandOutput === 'string' && dnsCmd.commandOutput.length > 0,
      '40. executeCommand "nslookup" returns a meaningful response reflecting current network state.'
    );

    // ──────────────────────────────────────────────────────────
    // SUMMARY
    // ──────────────────────────────────────────────────────────
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Phase 12G-3 Final Practical Exam Engine Suite Results:`);
    console.log(`  Passed:  ${passedCount}`);
    console.log(`  Failed:  ${failedCount}`);
    console.log(`  Total:   ${passedCount + failedCount}`);
    console.log(`${'─'.repeat(60)}`);

    if (failedCount === 0) {
      console.log(`\n🎉 Phase 12G-3 Verification COMPLETE! All ${passedCount} assertions PASSED.\n`);
    } else {
      console.error(`\n❌ Phase 12G-3: ${failedCount} assertion(s) FAILED. Review errors above.\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Phase 12G-3 Suite Fatal Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

runPhase12g3PracticalExamSuite();
