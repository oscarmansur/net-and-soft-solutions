import { describe, it, expect, beforeEach } from "vitest";
import { rateLimiter, checkSubmissionRateLimits } from "@/lib/rate-limit";

describe("Sliding Window Rate Limiter", () => {
  beforeEach(() => {
    rateLimiter.reset("test:key");
  });

  it("allows requests under the specified limit", () => {
    const res1 = rateLimiter.check("test:key", 3, 60);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = rateLimiter.check("test:key", 3, 60);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = rateLimiter.check("test:key", 3, 60);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests once the limit is reached and provides reset seconds", () => {
    rateLimiter.check("test:key", 2, 60);
    rateLimiter.check("test:key", 2, 60);

    const blocked = rateLimiter.check("test:key", 2, 60);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThan(0);
    expect(blocked.resetSeconds).toBeLessThanOrEqual(60);
  });

  it("enforces multi-dimensional rate limits for submission", () => {
    const ipHash = "dummy_ip_hash_123";
    const proposalId = "prop-abc";
    const email = "tester@test.com";

    const check = checkSubmissionRateLimits({ ipHash, proposalId, email });
    expect(check.allowed).toBe(true);
  });
});
