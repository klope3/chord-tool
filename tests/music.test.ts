import {
  getAbsIndexSequence,
  getNextPitch,
  // getPitchSequence,
  parsePitch,
  // pitchDataToString,
} from "../src/musicCalc";

describe("Pitch parsing", () => {
  test("C5", () => {
    const result = parsePitch("C5");
    expect(result.absoluteIndex).toEqual(60);
  });
  test("B#4", () => {
    const result = parsePitch("B#4");
    expect(result.absoluteIndex).toEqual(60);
  });
  test("B4", () => {
    const result = parsePitch("B4");
    expect(result.absoluteIndex).toEqual(59);
  });
  test("Cb5", () => {
    const result = parsePitch("Cb5");
    expect(result.absoluteIndex).toEqual(59);
  });
});

describe("Intervals", () => {
  //Errors
  test("Throw error for starting pitch with no letter", () => {
    expect(() => {
      getNextPitch("4", 1);
    }).toThrow();
  });
  test("Throw error for starting pitch with no number", () => {
    expect(() => {
      getNextPitch("C", 1);
    }).toThrow();
  });
  test("Throw error for bad interval", () => {
    expect(() => {
      getNextPitch("C", 0);
    }).toThrow();
  });
  //Basic intervals
  test("1 half-step", () => {
    testInterval({
      startingPitch: "C4",
      halfSteps: 1,
      expectedNextPitch: "C#4",
    });
  });
  test("2 half-steps", () => {
    testInterval({
      startingPitch: "C#4",
      halfSteps: 2,
      expectedNextPitch: "D#4",
    });
  });
  test("3 half-steps", () => {
    testInterval({
      startingPitch: "D4",
      halfSteps: 3,
      expectedNextPitch: "F4",
    });
  });
  test("4 half-steps", () => {
    testInterval({
      startingPitch: "D#4",
      halfSteps: 4,
      expectedNextPitch: "G4",
    });
  });
  test("5 half-steps", () => {
    testInterval({
      startingPitch: "E4",
      halfSteps: 5,
      expectedNextPitch: "A4",
    });
  });
  test("6 half-steps", () => {
    testInterval({
      startingPitch: "F4",
      halfSteps: 6,
      expectedNextPitch: "B4",
    });
  });
  test("7 half-steps", () => {
    testInterval({
      startingPitch: "Gb4",
      halfSteps: 7,
      expectedNextPitch: "Db5",
    });
  });
  test("8 half-steps", () => {
    testInterval({
      startingPitch: "G4",
      halfSteps: 8,
      expectedNextPitch: "Eb5",
    });
  });
  test("9 half-steps", () => {
    testInterval({
      startingPitch: "Ab4",
      halfSteps: 9,
      expectedNextPitch: "F5",
    });
  });
  test("10 half-steps", () => {
    testInterval({
      startingPitch: "A4",
      halfSteps: 10,
      expectedNextPitch: "G5",
    });
  });
  test("11 half-steps", () => {
    testInterval({
      startingPitch: "Bb4",
      halfSteps: 11,
      expectedNextPitch: "A5",
    });
  });
  test("12 half-steps", () => {
    testInterval({
      startingPitch: "B4",
      halfSteps: 12,
      expectedNextPitch: "B5",
    });
  });
  test("1 half-step", () => {
    testInterval({
      startingPitch: "B4",
      halfSteps: 1,
      expectedNextPitch: "C5",
    });
  });
  test("2 half-steps", () => {
    testInterval({
      startingPitch: "Bb4",
      halfSteps: 2,
      expectedNextPitch: "C5",
    });
  });
  test("3 half-steps", () => {
    testInterval({
      startingPitch: "A4",
      halfSteps: 3,
      expectedNextPitch: "C5",
    });
  });
  test("4 half-steps", () => {
    testInterval({
      startingPitch: "Ab4",
      halfSteps: 4,
      expectedNextPitch: "C5",
    });
  });
  test("5 half-steps", () => {
    testInterval({
      startingPitch: "G4",
      halfSteps: 5,
      expectedNextPitch: "C5",
    });
  });

  //!B# is an edge case because it's equivalent to C, but these must have different pitch numbers to sound the same.
  //!B#4 sounds the same as C5. B#5 sounds the same as C6, so B#5 != C5.
  //!This is different from every other pitch equivalent group. For example, C#5 === Db5.
  //!Figure out how to handle this.
  test("End of octave edge case", () => {
    testInterval({
      startingPitch: "A#4",
      halfSteps: 2,
      expectedNextPitch: "B#4",
    });
  });
});

describe("Sequences", () => {
  const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
  test("C major scale", () => {
    // const sequence = getAbsIndexSequence("C4", majorScaleIntervals);
    // expect(sequence).toEqual(
    //   ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"].map(
    //     (str) => parsePitch(str).absoluteIndex
    //   )
    // );
    testSequence({
      startingPitch: "C4",
      halfStepIntervals: majorScaleIntervals,
      expectedPitches: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    });
  });
  test("C# major scale", () => {
    // const sequence = getAbsIndexSequence("C#4", majorScaleIntervals);
    // expect(sequence).toEqual(
    //   ["C#4", "D#4", "E#4", "F#4", "G#4", "A#4", "B#4", "C#5"].map(
    //     (str) => parsePitch(str).absoluteIndex
    //   )
    // );
    testSequence({
      startingPitch: "C#4",
      halfStepIntervals: majorScaleIntervals,
      expectedPitches: ["C#4", "D#4", "E#4", "F#4", "G#4", "A#4", "B#4", "C#5"],
    });
  });
});

function testInterval(params: {
  startingPitch: string;
  halfSteps: number;
  expectedNextPitch: string;
}) {
  const { startingPitch, expectedNextPitch, halfSteps } = params;
  const result = getNextPitch(startingPitch, halfSteps);
  const parsedExpected = parsePitch(expectedNextPitch);

  expect(parsedExpected.absoluteIndex).toEqual(result.absoluteIndex);
  expect(parsedExpected.pitchEquivalentGroup).toEqual(
    result.pitchEquivalentGroup
  );
  expect(parsedExpected.scaleIndex).toEqual(result.scaleIndex);

  // if (parsedExpected.accidental === "flat") {
  //   expect(pitchDataToString(result, "flat")).toBe(expectedNextPitch);
  // } else if (parsedExpected.accidental === "sharp") {
  //   expect(pitchDataToString(result, "sharp")).toBe(expectedNextPitch);
  // } else {
  //   expect(pitchDataToString(result)).toBe(expectedNextPitch);
  // }
}

function testSequence(params: {
  startingPitch: string;
  halfStepIntervals: number[];
  expectedPitches: string[];
}) {
  const { expectedPitches, halfStepIntervals, startingPitch } = params;
  const result = getAbsIndexSequence(startingPitch, halfStepIntervals);
  expect(result).toEqual(
    expectedPitches.map((pitch) => parsePitch(pitch).absoluteIndex)
  );
}
