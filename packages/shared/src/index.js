"use strict";
// NetVision Shared Package Exports
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ROUTES = void 0;
__exportStar(require("./models/KnowledgeModel"), exports);
__exportStar(require("./models/SandboxModel"), exports);
__exportStar(require("./models/TroubleshootingModel"), exports);
exports.API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    COURSES: {
        LIST: '/courses',
        DETAIL: (slug) => `/courses/${slug}`,
        LESSONS: (courseSlug) => `/courses/${courseSlug}/lessons`,
    },
    USER: {
        PROFILE: '/users/profile',
        PROGRESS: '/users/progress',
    },
    TROUBLESHOOTING: {
        SCENARIOS: '/troubleshooting/scenarios',
        DETAIL: (slug) => `/troubleshooting/scenarios/${slug}`,
        START_SESSION: '/troubleshooting/session/start',
        EXECUTE_COMMAND: '/troubleshooting/session/execute',
        DIAGNOSE: '/troubleshooting/session/diagnose',
        REMEDIATE: '/troubleshooting/session/remediate',
        VERIFY: '/troubleshooting/session/verify',
        POST_MORTEM: (slug) => `/troubleshooting/scenarios/${slug}/post-mortem`,
    },
};
