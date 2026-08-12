export interface TechnicalComponent {
  name: string;
  detail: string;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  action: string;
}

export interface HeaderFieldView {
  fieldName: string;
  bitLength: string;
  hexSample?: string;
  description: string;
}

export interface CliToolingItem {
  command: string;
  description: string;
  expectedOutput: string;
  proofExplanation: string;
}

export interface TroubleshootingItem {
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  remediation: string;
}

export interface CommonMistakeItem {
  misconception: string;
  correction: string;
}

export interface LessonStepMetadata {
  step1_objective: string;
  step2_prerequisites: string[];
  step3_whyItMatters: string;
  step4_coreConcept: string;
  step5_technicalAnatomy: {
    title: string;
    description: string;
    components: TechnicalComponent[];
  };
  step6_howItWorks: {
    steps: HowItWorksStep[];
  };
  step7_packetHeaderView: {
    protocol: string;
    fields: HeaderFieldView[];
    headerDiagramAscii?: string;
  };
  step8_visualExplanation: {
    type: string;
    title: string;
    description: string;
    nodesOrFrames?: any[];
  };
  step9_workedExample: {
    title: string;
    problemStatement: string;
    stepByStepSolution: string[];
    finalResult: string;
  };
  step10_realWorldScenario: {
    topology: string;
    scenarioText: string;
    engineeringContext: string;
  };
  step11_deviceBehavior: {
    hostBehavior: string;
    nicBehavior: string;
    switchOrRouterBehavior: string;
  };
  step12_cliTooling: CliToolingItem[];
  step13_troubleshooting: TroubleshootingItem[];
  step14_commonMistakes: CommonMistakeItem[];
  step15_securityPerspective: {
    threatOrVulnerability: string;
    mitigationStrategy: string;
  };
  step16_examPrep: {
    keyExamPoints: string[];
    frequentTraps: string[];
  };
  step17_practicalLabRef: {
    title: string;
    scenario: string;
    tasks: string[];
    verificationMethod: string;
  };
  step18_masterySummary: {
    summaryPoints: string[];
    nextLessonBridge: string;
  };
}
