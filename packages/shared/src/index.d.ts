export * from './models/KnowledgeModel';
export * from './models/SandboxModel';
export * from './models/TroubleshootingModel';
export declare const API_ROUTES: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly REFRESH: "/auth/refresh";
        readonly ME: "/auth/me";
    };
    readonly COURSES: {
        readonly LIST: "/courses";
        readonly DETAIL: (slug: string) => string;
        readonly LESSONS: (courseSlug: string) => string;
    };
    readonly USER: {
        readonly PROFILE: "/users/profile";
        readonly PROGRESS: "/users/progress";
    };
    readonly TROUBLESHOOTING: {
        readonly SCENARIOS: "/troubleshooting/scenarios";
        readonly DETAIL: (slug: string) => string;
        readonly START_SESSION: "/troubleshooting/session/start";
        readonly EXECUTE_COMMAND: "/troubleshooting/session/execute";
        readonly DIAGNOSE: "/troubleshooting/session/diagnose";
        readonly REMEDIATE: "/troubleshooting/session/remediate";
        readonly VERIFY: "/troubleshooting/session/verify";
        readonly POST_MORTEM: (slug: string) => string;
    };
};
