"use strict";
// NetVision Universal Networking Knowledge Model Schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeModelSerializer = void 0;
class KnowledgeModelSerializer {
    static exportToJson(item) {
        return JSON.stringify(item, null, 2);
    }
    static importFromJson(jsonString) {
        const parsed = JSON.parse(jsonString);
        if (!parsed.id || !parsed.slug || !parsed.theoryBlocks) {
            throw new Error('Invalid UniversalKnowledgeItem JSON schema structure');
        }
        return parsed;
    }
}
exports.KnowledgeModelSerializer = KnowledgeModelSerializer;
