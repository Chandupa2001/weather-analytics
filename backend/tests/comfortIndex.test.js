import { computeComfortIndex } from "../src/services/comfortIndexService.js";

describe("computeComfortIndex", () => {
  test("returns 100 for perfectly ideal conditions", () => {
    const { score } = computeComfortIndex({
      tempC: 21,
      humidity: 40,
      windSpeedMs: 2,
      cloudPct: 30,
    });
    expect(score).toBe(100);
  });

  test("returns a low score for hot, humid, windy, overcast weather", () => {
    const { score } = computeComfortIndex({
      tempC: 40,
      humidity: 100,
      windSpeedMs: 15,
      cloudPct: 100,
    });
    expect(score).toBeLessThan(30);
  });

  test("score always stays within 0-100", () => {
    const extremeHot = computeComfortIndex({
      tempC: 55,
      humidity: 100,
      windSpeedMs: 25,
      cloudPct: 100,
    });
    const extremeCold = computeComfortIndex({
      tempC: -40,
      humidity: 0,
      windSpeedMs: 30,
      cloudPct: 0,
    });
    expect(extremeHot.score).toBeGreaterThanOrEqual(0);
    expect(extremeHot.score).toBeLessThanOrEqual(100);
    expect(extremeCold.score).toBeGreaterThanOrEqual(0);
    expect(extremeCold.score).toBeLessThanOrEqual(100);
  });

  test("cold cities score lower than mild cities", () => {
    const mild = computeComfortIndex({ tempC: 20, humidity: 45, windSpeedMs: 1.5, cloudPct: 25 });
    const cold = computeComfortIndex({ tempC: -10, humidity: 45, windSpeedMs: 1.5, cloudPct: 25 });
    expect(mild.score).toBeGreaterThan(cold.score);
  });

  test("breakdown weights sum to 1", () => {
    const { weights } = computeComfortIndex({ tempC: 20, humidity: 45, windSpeedMs: 1.5, cloudPct: 25 });
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1);
  });
});
