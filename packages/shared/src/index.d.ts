export * from './models/KnowledgeModel';
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
};
