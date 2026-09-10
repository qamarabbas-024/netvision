-- NetVision Drop #9: Active Exam Attempt Partial Unique Index
-- Guarantees that at most ONE IN_PROGRESS exam attempt can exist for a given user and certification code.
-- Non-destructive, idempotent, and preserves all historical completed/failed/expired records.

CREATE UNIQUE INDEX IF NOT EXISTS "exam_attempts_user_active_in_progress_unique_idx"
ON "exam_attempts" ("userId", "certificationCode")
WHERE "status" = 'IN_PROGRESS';