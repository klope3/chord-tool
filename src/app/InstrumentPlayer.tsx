"use client";

import {
  bpmToQuarterNoteDuration,
  getPlayableSequence,
  majorFourth,
  majorSecond,
  majorThird,
  minorThird,
} from "@/musicCalc";
import { useEffect, useState } from "react";
import * as Tone from "tone";

export function InstrumentPlayer() {
  const [piano, setPiano] = useState(
    null as Tone.Sampler | Tone.PolySynth | null
  );
  const [tempoBpm, setTempoBpm] = useState(60);

  useEffect(() => {
    async function startAudioContext() {
      await Tone.start();
      console.log("Audio context started");
    }
    startAudioContext();

    setPiano(createInstrument());
  }, []);

  function createInstrument() {
    if (navigator.onLine)
      return new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination();
    else {
      console.error("No Internet connection; defaulting to basic synth");
      return new Tone.PolySynth(Tone.Synth).toDestination();
    }
  }

  function clickProg1() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorFourth, majorThird]),
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      getPlayableSequence("B3", [minorThird, majorFourth]),
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickProg2() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      getPlayableSequence("Bb3", [majorSecond, majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      getPlayableSequence("A3", [minorThird, majorFourth]),
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      getPlayableSequence("B3", [minorThird, majorFourth]),
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      getPlayableSequence("C4", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickProg3() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    piano.triggerAttackRelease(
      getPlayableSequence("A3", [minorThird, majorThird]),
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      getPlayableSequence("F3", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      getPlayableSequence("G3", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      getPlayableSequence("E3", [majorThird, minorThird]),
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      getPlayableSequence("A3", [minorThird, majorThird]),
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickScale() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    const notes = getPlayableSequence(
      "C4",
      [2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1]
    );
    for (let i = 0; i < notes.length; i++) {
      piano.triggerAttackRelease(
        notes[i]!,
        `${quarter / 2}`,
        now + (quarter / 2) * i
      );
    }
  }

  return (
    <div>
      <button onClick={clickProg1}>Play Chord Progression 1</button>
      <button onClick={clickProg2}>Play Chord Progression 2</button>
      <button onClick={clickProg3}>Play Chord Progression 3</button>
      <button onClick={clickScale}>Play Scale</button>
      <button onClick={() => setTempoBpm(60)}>Set Tempo 60</button>
      <button onClick={() => setTempoBpm(80)}>Set Tempo 80</button>
      <button onClick={() => setTempoBpm(100)}>Set Tempo 100</button>
    </div>
  );
}

export default InstrumentPlayer;
