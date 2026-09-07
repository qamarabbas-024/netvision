import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExamAttemptStatus } from '@prisma/client';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

export interface CourseEligibilityResult {
  courseCode: string;
  courseTitle: string;
  credentialCode: string;
  credentialTitle: string;
  eligible: boolean;
  hasCertificate: boolean;
  existingCertificate?: {
    id: string;
    credentialId: string | null;
    issuedAt: Date;
    status: string;
  };
  blockingRequirements: string[];
  breakdown: {
    lessons: {
      total: number;
      completed: number;
      passed: boolean;
    };
    assessments: {
      requiredCount: number;
      attemptedCount: number;
      averageScore: number;
      minRequiredScore: number;
      passed: boolean;
    };
    labs: {
      total: number;
      passedCount: number;
      passed: boolean;
    };
  };
}

export interface MasteryEligibilityResult {
  credentialCode: string;
  credentialTitle: string;
  eligible: boolean;
  hasCertificate: boolean;
  existingCertificate?: {
    id: string;
    credentialId: string | null;
    issuedAt: Date;
    status: string;
  };
  blockingRequirements: string[];
  breakdown: {
    courseCertificates: {
      requiredCodes: string[];
      acquiredCodes: string[];
      missingCodes: string[];
      passed: boolean;
    };
    flagshipLessons: {
      total: number;
      completed: number;
      passed: boolean;
    };
    cumulativeAssessments: {
      requiredQuizzes: number;
      attemptedQuizzes: number;
      cumulativeAverage: number;
      minRequiredAverage: number;
      passed: boolean;
    };
    flagshipLabs: {
      total: number;
      passedCount: number;
      passed: boolean;
    };
    masterCapstone: {
      passed: boolean;
      score: number | null;
      attemptId: string | null;
      completedAt: Date | null;
    };
  };
}

@Injectable()
export class CertificationEligibilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates server-side certification eligibility for an individual flagship course (NV-C01 through NV-C05).
   * Verifies:
   * 1. 100% completion of all required lessons
   * 2. Assessment benchmark average >= 80%
   * 3. All required practical labs passed
   */
  async checkCourseEligibility(userId: string, courseIdentifier: string): Promise<CourseEligibilityResult> {
    if (!userId) {
      throw new BadRequestException('A valid authenticated User ID is required to calculate eligibility.');
    }

    const normalized = (courseIdentifier || '').trim().toUpperCase();
    const flagshipDef = FLAGSHIP_5_COURSES.find(
      (c) => c.code === normalized || c.credentialCode === normalized || c.slug.toUpperCase() === normalized
    );

    const course = await this.prisma.course.findFirst({
      where: {
        OR: [
          { code: flagshipDef ? flagshipDef.code : normalized },
          { slug: flagshipDef ? flagshipDef.slug : courseIdentifier.toLowerCase() },
        ],
      },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quizzes: { select: { id: true } },
                labs: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Flagship course "${courseIdentifier}" not found.`);
    }

    const courseCode = course.code;
    const credentialCode = `NV-NET-${courseCode.replace('NV-', '')}`; // NV-C01 -> NV-NET-C01
    const certDef = await this.prisma.certificationDefinition.findUnique({
      where: { code: credentialCode },
    });
    const credentialTitle = certDef?.title || `${course.title} Professional Certification`;

    // 0. Check existing certificate
    const existingCert = await this.prisma.certificate.findFirst({
      where: {
        userId,
        OR: [
          { certificationCode: credentialCode },
          { courseId: course.id },
        ],
        status: 'ACTIVE',
      },
    });

    // 1. Lessons check (100% completion)
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const allLessonIds = allLessons.map((l) => l.id);

    const completedProgressCount = await this.prisma.userProgress.count({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    });
    const lessonsPassed = totalLessons > 0 && completedProgressCount >= totalLessons;

    // 2. Assessment Benchmark Average Check (>= 80%)
    const requiredQuizIds = allLessons.flatMap((l) => l.quizzes.map((q) => q.id));
    let assessmentAvg = 0;
    let quizAttemptsCount = 0;
    let assessmentsPassed = false;

    if (requiredQuizIds.length > 0) {
      const quizAttempts = await this.prisma.quizAttempt.findMany({
        where: {
          userId,
          quizId: { in: requiredQuizIds },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Compute best score per distinct quiz to avoid penalizing early practice
      const bestScoresMap = new Map<string, number>();
      for (const attempt of quizAttempts) {
        const currentBest = bestScoresMap.get(attempt.quizId) ?? 0;
        if (attempt.score > currentBest) {
          bestScoresMap.set(attempt.quizId, attempt.score);
        }
      }

      quizAttemptsCount = bestScoresMap.size;
      if (quizAttemptsCount > 0) {
        const totalScore = Array.from(bestScoresMap.values()).reduce((sum, score) => sum + score, 0);
        assessmentAvg = Math.round(totalScore / quizAttemptsCount);
      }
      // Must have attempted all required quizzes and reached >= 80% average
      assessmentsPassed = quizAttemptsCount >= requiredQuizIds.length && assessmentAvg >= 80;
    } else {
      // If course has no quizzes, pass by default
      assessmentsPassed = true;
      assessmentAvg = 100;
    }

    // 3. Required Practical Labs Check (Each distinct lab individually passed)
    const requiredLabIds = allLessons.flatMap((l) => l.labs.map((lab) => lab.id));
    let labsPassed = true;
    let passedLabCount = 0;

    if (requiredLabIds.length > 0) {
      const distinctPassedLabs = await this.prisma.labAttempt.findMany({
        where: {
          userId,
          labId: { in: requiredLabIds },
          passed: true,
        },
        distinct: ['labId'],
        select: { labId: true },
      });
      passedLabCount = distinctPassedLabs.length;
      labsPassed = passedLabCount >= requiredLabIds.length;
    }

    // Determine blockers
    const blockingRequirements: string[] = [];
    if (existingCert) {
      blockingRequirements.push(`Active certificate already issued on ${new Date(existingCert.issuedAt).toLocaleDateString()}`);
    }
    if (!lessonsPassed) {
      blockingRequirements.push(
        `Incomplete curriculum: ${completedProgressCount} of ${totalLessons} required lessons completed (100% required)`
      );
    }
    if (!assessmentsPassed) {
      if (quizAttemptsCount < requiredQuizIds.length) {
        blockingRequirements.push(
          `Incomplete assessments: ${quizAttemptsCount} of ${requiredQuizIds.length} required quizzes attempted`
        );
      } else {
        blockingRequirements.push(
          `Assessment benchmark score ${assessmentAvg}% is below the minimum required 80% average`
        );
      }
    }
    if (!labsPassed) {
      blockingRequirements.push(
        `Incomplete practical labs: ${passedLabCount} of ${requiredLabIds.length} required labs passed`
      );
    }

    const eligible = !existingCert && lessonsPassed && assessmentsPassed && labsPassed;

    return {
      courseCode,
      courseTitle: course.title,
      credentialCode,
      credentialTitle,
      eligible,
      hasCertificate: !!existingCert,
      existingCertificate: existingCert
        ? {
            id: existingCert.id,
            credentialId: existingCert.credentialId,
            issuedAt: existingCert.issuedAt,
            status: existingCert.status,
          }
        : undefined,
      blockingRequirements,
      breakdown: {
        lessons: {
          total: totalLessons,
          completed: completedProgressCount,
          passed: lessonsPassed,
        },
        assessments: {
          requiredCount: requiredQuizIds.length,
          attemptedCount: quizAttemptsCount,
          averageScore: assessmentAvg,
          minRequiredScore: 80,
          passed: assessmentsPassed,
        },
        labs: {
          total: requiredLabIds.length,
          passedCount: passedLabCount,
          passed: labsPassed,
        },
      },
    };
  }

  /**
   * Evaluates server-side Mastery eligibility for NV-NET-MASTERY.
   * Hard blockers:
   * 1. Active NV-NET-C01 certificate exists
   * 2. Active NV-NET-C02 certificate exists
   * 3. Active NV-NET-C03 certificate exists
   * 4. Active NV-NET-C04 certificate exists
   * 5. Active NV-NET-C05 certificate exists
   * 6. 100% of all flagship required lessons completed
   * 7. Cumulative assessment average >= 85%
   * 8. All required flagship labs passed
   * 9. Master Capstone passed (score >= 85%)
   */
  async checkMasteryEligibility(userId: string): Promise<MasteryEligibilityResult> {
    if (!userId) {
      throw new BadRequestException('A valid authenticated User ID is required to calculate Mastery eligibility.');
    }

    const masteryCertDef = await this.prisma.certificationDefinition.findUnique({
      where: { code: 'NV-NET-MASTERY' },
    });
    const credentialTitle = masteryCertDef?.title || 'NetVision Network Engineering Mastery';

    // Check existing Mastery Certificate
    const existingMasteryCert = await this.prisma.certificate.findFirst({
      where: {
        userId,
        certificationCode: 'NV-NET-MASTERY',
        status: 'ACTIVE',
      },
    });

    // 1-5. Verify all 5 course certificates exist and are ACTIVE
    const requiredCourseCertCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];
    const activeCerts = await this.prisma.certificate.findMany({
      where: {
        userId,
        certificationCode: { in: requiredCourseCertCodes },
        status: 'ACTIVE',
      },
      select: { certificationCode: true },
    });

    const acquiredCertCodes = Array.from(new Set(activeCerts.map((c) => c.certificationCode!).filter(Boolean)));
    const missingCertCodes = requiredCourseCertCodes.filter((code) => !acquiredCertCodes.includes(code));
    const courseCertsPassed = missingCertCodes.length === 0;

    // 6. 100% Flagship Lessons Check across all 5 courses
    const flagshipCourses = await this.prisma.course.findMany({
      where: { code: { in: ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'] } },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quizzes: { select: { id: true } },
                labs: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    const allFlagshipLessons = flagshipCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
    const totalFlagshipLessons = allFlagshipLessons.length;
    const allFlagshipLessonIds = allFlagshipLessons.map((l) => l.id);

    const completedLessonsCount = await this.prisma.userProgress.count({
      where: {
        userId,
        lessonId: { in: allFlagshipLessonIds },
        completed: true,
      },
    });
    const flagshipLessonsPassed = totalFlagshipLessons > 0 && completedLessonsCount >= totalFlagshipLessons;

    // 7. Cumulative Assessment Average >= 85%
    const allRequiredQuizIds = allFlagshipLessons.flatMap((l) => l.quizzes.map((q) => q.id));
    let cumulativeAvg = 0;
    let attemptedQuizCount = 0;
    let cumulativeAssessmentsPassed = false;

    if (allRequiredQuizIds.length > 0) {
      const allAttempts = await this.prisma.quizAttempt.findMany({
        where: {
          userId,
          quizId: { in: allRequiredQuizIds },
        },
        orderBy: { createdAt: 'desc' },
      });

      const bestScoresMap = new Map<string, number>();
      for (const attempt of allAttempts) {
        const currentBest = bestScoresMap.get(attempt.quizId) ?? 0;
        if (attempt.score > currentBest) {
          bestScoresMap.set(attempt.quizId, attempt.score);
        }
      }

      attemptedQuizCount = bestScoresMap.size;
      if (attemptedQuizCount > 0) {
        const total = Array.from(bestScoresMap.values()).reduce((sum, s) => sum + s, 0);
        cumulativeAvg = Math.round(total / attemptedQuizCount);
      }
      cumulativeAssessmentsPassed = attemptedQuizCount >= allRequiredQuizIds.length && cumulativeAvg >= 85;
    } else {
      cumulativeAssessmentsPassed = true;
      cumulativeAvg = 100;
    }

    // 8. All Flagship Practical Labs Passed
    const allRequiredLabIds = allFlagshipLessons.flatMap((l) => l.labs.map((lab) => lab.id));
    let flagshipLabsPassed = true;
    let passedLabCount = 0;

    if (allRequiredLabIds.length > 0) {
      const distinctPassedLabs = await this.prisma.labAttempt.findMany({
        where: {
          userId,
          labId: { in: allRequiredLabIds },
          passed: true,
        },
        distinct: ['labId'],
        select: { labId: true },
      });
      passedLabCount = distinctPassedLabs.length;
      flagshipLabsPassed = passedLabCount >= allRequiredLabIds.length;
    }

    // 9. Master Capstone Passed (ExamAttempt passed with score >= 85%)
    const passedCapstoneAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        userId,
        certificationCode: 'NV-NET-MASTERY',
        status: ExamAttemptStatus.PASSED,
        passed: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    const capstonePassed = !!passedCapstoneAttempt && (passedCapstoneAttempt.score ?? 0) >= 85;

    // Compile blocking requirements
    const blockingRequirements: string[] = [];
    if (existingMasteryCert) {
      blockingRequirements.push(
        `Active Mastery certificate already issued on ${new Date(existingMasteryCert.issuedAt).toLocaleDateString()}`
      );
    }
    if (!courseCertsPassed) {
      blockingRequirements.push(
        `Missing active course certifications: ${missingCertCodes.join(', ')} (${acquiredCertCodes.length}/5 acquired)`
      );
    }
    if (!flagshipLessonsPassed) {
      blockingRequirements.push(
        `Incomplete curriculum: ${completedLessonsCount} of ${totalFlagshipLessons} flagship lessons completed (100% required)`
      );
    }
    if (!cumulativeAssessmentsPassed) {
      if (attemptedQuizCount < allRequiredQuizIds.length) {
        blockingRequirements.push(
          `Incomplete quizzes: ${attemptedQuizCount} of ${allRequiredQuizIds.length} flagship quizzes completed`
        );
      } else {
        blockingRequirements.push(
          `Cumulative assessment average ${cumulativeAvg}% is below the required 85% threshold`
        );
      }
    }
    if (!flagshipLabsPassed) {
      blockingRequirements.push(
        `Incomplete practical labs: ${passedLabCount} of ${allRequiredLabIds.length} required flagship labs passed`
      );
    }
    if (!capstonePassed) {
      if (!passedCapstoneAttempt) {
        blockingRequirements.push('Master Capstone Examination (NV-NET-MASTERY-EXAM) has not been passed');
      } else {
        blockingRequirements.push(
          `Master Capstone score of ${passedCapstoneAttempt.score}% is below the 85% passing threshold`
        );
      }
    }

    const eligible =
      !existingMasteryCert &&
      courseCertsPassed &&
      flagshipLessonsPassed &&
      cumulativeAssessmentsPassed &&
      flagshipLabsPassed &&
      capstonePassed;

    return {
      credentialCode: 'NV-NET-MASTERY',
      credentialTitle,
      eligible,
      hasCertificate: !!existingMasteryCert,
      existingCertificate: existingMasteryCert
        ? {
            id: existingMasteryCert.id,
            credentialId: existingMasteryCert.credentialId,
            issuedAt: existingMasteryCert.issuedAt,
            status: existingMasteryCert.status,
          }
        : undefined,
      blockingRequirements,
      breakdown: {
        courseCertificates: {
          requiredCodes: requiredCourseCertCodes,
          acquiredCodes: acquiredCertCodes,
          missingCodes: missingCertCodes,
          passed: courseCertsPassed,
        },
        flagshipLessons: {
          total: totalFlagshipLessons,
          completed: completedLessonsCount,
          passed: flagshipLessonsPassed,
        },
        cumulativeAssessments: {
          requiredQuizzes: allRequiredQuizIds.length,
          attemptedQuizzes: attemptedQuizCount,
          cumulativeAverage: cumulativeAvg,
          minRequiredAverage: 85,
          passed: cumulativeAssessmentsPassed,
        },
        flagshipLabs: {
          total: allRequiredLabIds.length,
          passedCount: passedLabCount,
          passed: flagshipLabsPassed,
        },
        masterCapstone: {
          passed: capstonePassed,
          score: passedCapstoneAttempt?.score ?? null,
          attemptId: passedCapstoneAttempt?.id ?? null,
          completedAt: passedCapstoneAttempt?.submittedAt ?? null,
        },
      },
    };
  }
}
