import { describe, it, expect } from "vitest";
import { calculatePricing, formatCleanNumber, formatMinutesFriendly } from "@/lib/calculations";

describe("Pricing and Hours Calculation Engine", () => {
  it("calculates price per hour accurately: USD 120 / 20h = USD 6/h", () => {
    const result = calculatePricing({
      monthlyPrice: 120,
      includedHours: 20,
      extraHourPrice: 10,
      alertPercentage: 80,
    });

    expect(result.monthlyPrice).toBe(120);
    expect(result.includedHours).toBe(20);
    expect(result.pricePerHour).toBe(6);
    expect(result.alertHours).toBe(16); // 20 * 80% = 16
    expect(result.extraHourPrice).toBe(10);
    expect(result.formatted.pricePerHour).toBe("USD 6");
    expect(result.formatted.monthlyPrice).toBe("USD 120");
    expect(result.formatted.includedHours).toBe("20 horas");
  });

  it("calculates extra hours and total estimated cost when usedHours exceeds includedHours", () => {
    const result = calculatePricing({
      monthlyPrice: 120,
      includedHours: 20,
      extraHourPrice: 10,
      usedHours: 25, // 5 extra hours
    });

    expect(result.extraHours).toBe(5);
    expect(result.extraAmount).toBe(50); // 5 * 10 = 50
    expect(result.estimatedTotal).toBe(170); // 120 + 50 = 170
    expect(result.remainingHours).toBe(0);
    expect(result.formatted.extraAmount).toBe("USD 50");
    expect(result.formatted.estimatedTotal).toBe("USD 170");
  });

  it("calculates remaining hours when usedHours is less than includedHours", () => {
    const result = calculatePricing({
      monthlyPrice: 120,
      includedHours: 20,
      extraHourPrice: 10,
      usedHours: 12,
    });

    expect(result.remainingHours).toBe(8); // 20 - 12 = 8
    expect(result.extraHours).toBe(0);
    expect(result.extraAmount).toBe(0);
    expect(result.estimatedTotal).toBe(120);
  });

  it("formats numbers without trailing redundant decimals (e.g. 6.00 -> 6)", () => {
    expect(formatCleanNumber(6, true, "USD")).toBe("USD 6");
    expect(formatCleanNumber(120, true, "USD")).toBe("USD 120");
    expect(formatCleanNumber(6.5, true, "USD")).toBe("USD 6.50");
    expect(formatCleanNumber(20, false)).toBe("20");
  });

  it("formats minute ranges to friendly hour strings", () => {
    expect(formatMinutesFriendly(15, 30)).toBe("15 a 30 minutos");
    expect(formatMinutesFriendly(120, 300)).toBe("2 a 5 horas");
    expect(formatMinutesFriendly(60, 120)).toBe("1 a 2 horas");
  });
});
