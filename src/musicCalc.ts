type EquivalentPitchData = {
  name: string;
  modifier: number;
  //for most equivalent groups, modifier is 0.
  //used for edge cases such as C and B#, where the two pitch names need
  //different pitch numbers to be equivalent.
  //B#3 and C4 are equivalent, not B#4 and C4. So the B# gets a modifier of -1 to express this.
};
type EquivalentPitchGroup = {
  natural?: EquivalentPitchData;
  sharp?: EquivalentPitchData;
  flat?: EquivalentPitchData;
};
const pitches: EquivalentPitchGroup[] = [
  {
    natural: {
      name: "C",
      modifier: 0,
    },
    sharp: {
      name: "B#",
      modifier: -1,
    },
  },
  {
    sharp: {
      name: "C#",
      modifier: 0,
    },
    flat: {
      name: "Db",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "D",
      modifier: 0,
    },
  },
  {
    sharp: {
      name: "D#",
      modifier: 0,
    },
    flat: {
      name: "Eb",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "E",
      modifier: 0,
    },
    flat: {
      name: "Fb",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "F",
      modifier: 0,
    },
    sharp: {
      name: "E#",
      modifier: 0,
    },
  },
  {
    sharp: {
      name: "F#",
      modifier: 0,
    },
    flat: {
      name: "Gb",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "G",
      modifier: 0,
    },
  },
  {
    sharp: {
      name: "G#",
      modifier: 0,
    },
    flat: {
      name: "Ab",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "A",
      modifier: 0,
    },
  },
  {
    sharp: {
      name: "A#",
      modifier: 0,
    },
    flat: {
      name: "Bb",
      modifier: 0,
    },
  },
  {
    natural: {
      name: "B",
      modifier: 0,
    },
    flat: {
      name: "Cb",
      modifier: 1,
    },
  },
];

export const minorSecond = 1,
  majorSecond = 2,
  minorThird = 3,
  majorThird = 4,
  majorFourth = 5;

export function bpmToQuarterNoteDuration(bpm: number) {
  return 60 / bpm;
}

export type PitchData = {
  scaleIndex: number;
  absoluteIndex: number;
  pitchEquivalentGroup: EquivalentPitchGroup;
  pitchNumber: number;
  accidental: "flat" | "sharp" | undefined;
};
export function parsePitch(pitch: string): PitchData {
  const withoutNumber = `${pitch.match(/[^\d]+/)}`;
  const indexOfPitch = pitches.findIndex((pitchEquivalentGroup) =>
    [
      pitchEquivalentGroup.natural?.name,
      pitchEquivalentGroup.flat?.name,
      pitchEquivalentGroup.sharp?.name,
    ].includes(withoutNumber)
  );
  const pitchEquivalentGroup = pitches[indexOfPitch];
  let pitchNumber = +`${pitch.match(/\d+/)}`;
  const accidentalChar = pitch.match(/b|#/);
  const accidental =
    `${accidentalChar}` === "b"
      ? "flat"
      : `${accidentalChar}` === "#"
      ? "sharp"
      : undefined;

  if (!pitchEquivalentGroup || isNaN(pitchNumber)) {
    throw new Error(`${pitch} is not a valid pitch.`);
  }

  const sharpModifier =
    pitchEquivalentGroup.sharp && accidental === "sharp"
      ? pitchEquivalentGroup.sharp.modifier
      : 0;
  const flatModifier =
    pitchEquivalentGroup.flat && accidental === "flat"
      ? pitchEquivalentGroup.flat.modifier
      : 0;

  return {
    absoluteIndex:
      indexOfPitch +
      (pitchNumber - sharpModifier - flatModifier) * pitches.length,
    scaleIndex: indexOfPitch,
    pitchEquivalentGroup,
    pitchNumber,
    accidental,
  };
}

export function getNextPitch(
  startingPitch: string,
  halfStepInterval: number
): Omit<PitchData, "accidental" | "pitchNumber"> {
  if (halfStepInterval < 1)
    throw new Error("Intervals less than 1 are not supported.");

  const parsed = parsePitch(startingPitch);
  const nextPitchIndex =
    (parsed.scaleIndex + halfStepInterval) % pitches.length;
  const nextPitchGroup = pitches[nextPitchIndex];
  if (!nextPitchGroup)
    throw new Error(
      `Failed to find the pitch group ${halfStepInterval} half-steps above ${startingPitch}.`
    );

  return {
    absoluteIndex: parsed.absoluteIndex + halfStepInterval,
    scaleIndex: nextPitchIndex,
    pitchEquivalentGroup: nextPitchGroup,
  };
}

export function getAbsIndexSequence(
  startingPitch: string,
  halfStepIntervals: number[]
) {
  const startingPitchParsed = parsePitch(startingPitch);
  const absIndices: number[] = [startingPitchParsed.absoluteIndex];
  let curAbsIndex = startingPitchParsed.absoluteIndex;
  for (const interval of halfStepIntervals) {
    curAbsIndex += interval;
    absIndices.push(curAbsIndex);
  }
  return absIndices;
}

function convertAbsolutePitchIndex(absIndex: number) {
  const scaleIndex = absIndex % pitches.length;
  const pitchNumber = Math.floor(absIndex / pitches.length);
  const pitchEquivalentGroup = pitches[scaleIndex];
  if (!pitchEquivalentGroup)
    throw new Error(`Invalid scale index ${scaleIndex}.`);

  const pitchWithoutModifier = [
    pitchEquivalentGroup.flat,
    pitchEquivalentGroup.natural,
    pitchEquivalentGroup.sharp,
  ].find((pitch) => pitch !== undefined && pitch.modifier === 0);
  if (!pitchWithoutModifier)
    throw new Error("Failed to find a pitch without modifier.");

  return `${pitchWithoutModifier.name}${pitchNumber}`;
}

//these pitches will not necessarily be correct in terms of music theory spelling.
//they are only intended to sound correct when played back by tone.js.
//the first pitch of the sequence will be the provided starting pitch.
export function getPlayableSequence(
  startingPitch: string,
  halfStepIntervals: number[]
) {
  const absIndexSequence = getAbsIndexSequence(
    startingPitch,
    halfStepIntervals
  );
  return absIndexSequence.map((absIndex) =>
    convertAbsolutePitchIndex(absIndex)
  );
}
