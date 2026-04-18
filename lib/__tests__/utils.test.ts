import { describe, it, expect } from "vitest";
import {
  formatTime,
  shuffleArray,
  parseDuration,
  formatCustomDuration,
} from "../utils";

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------
describe("formatTime", () => {
  it("formats 0 seconds as 0:00", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats seconds-only values (< 60)", () => {
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(59)).toBe("0:59");
  });

  it("formats exact minutes with zero seconds", () => {
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(120)).toBe("2:00");
    expect(formatTime(600)).toBe("10:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(90)).toBe("1:30");
    expect(formatTime(305)).toBe("5:05");
    expect(formatTime(3599)).toBe("59:59");
  });
});

// ---------------------------------------------------------------------------
// shuffleArray
// ---------------------------------------------------------------------------
describe("shuffleArray", () => {
  it("returns a new array with the same elements", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffleArray(original);
    expect(result).toHaveLength(original.length);
    expect(result.sort()).toEqual([...original].sort());
  });

  it("does not mutate the original array", () => {
    const original = [1, 2, 3];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it("handles an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

// ---------------------------------------------------------------------------
// parseDuration
// ---------------------------------------------------------------------------
describe("parseDuration", () => {
  it("returns null for empty string", () => {
    expect(parseDuration("")).toBeNull();
    expect(parseDuration("   ")).toBeNull();
  });

  it("parses a plain number as seconds", () => {
    expect(parseDuration("30")).toBe(30);
    expect(parseDuration("60")).toBe(60);
  });

  it("parses seconds with 's' suffix", () => {
    expect(parseDuration("30s")).toBe(30);
    expect(parseDuration("45S")).toBe(45);
  });

  it("parses minutes with 'm' suffix", () => {
    expect(parseDuration("2m")).toBe(120);
    expect(parseDuration("5m")).toBe(300);
  });

  it("parses combined minutes and seconds", () => {
    expect(parseDuration("5m 30s")).toBe(330);
    expect(parseDuration("1m30s")).toBe(90);
    expect(parseDuration("2m 15")).toBe(135);
  });

  it("is case-insensitive", () => {
    expect(parseDuration("2M")).toBe(120);
    expect(parseDuration("5M 30S")).toBe(330);
  });

  it("returns null for values below 5 seconds", () => {
    expect(parseDuration("4")).toBeNull();
    expect(parseDuration("0s")).toBeNull();
  });

  it("returns null for values above 3600 seconds (1 hour)", () => {
    expect(parseDuration("61m")).toBeNull();
    expect(parseDuration("3601")).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(parseDuration("abc")).toBeNull();
    expect(parseDuration("5x")).toBeNull();
    expect(parseDuration("--")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// formatCustomDuration
// ---------------------------------------------------------------------------
describe("formatCustomDuration", () => {
  it("formats values under 60 seconds with 's' suffix", () => {
    expect(formatCustomDuration(5)).toBe("5s");
    expect(formatCustomDuration(30)).toBe("30s");
    expect(formatCustomDuration(59)).toBe("59s");
  });

  it("formats exact minutes without seconds component", () => {
    expect(formatCustomDuration(60)).toBe("1m");
    expect(formatCustomDuration(120)).toBe("2m");
    expect(formatCustomDuration(600)).toBe("10m");
  });

  it("formats minutes and seconds together", () => {
    expect(formatCustomDuration(90)).toBe("1m 30s");
    expect(formatCustomDuration(330)).toBe("5m 30s");
    expect(formatCustomDuration(3599)).toBe("59m 59s");
  });
});
