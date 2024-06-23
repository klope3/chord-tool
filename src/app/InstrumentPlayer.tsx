"use client";

import { bpmToQuarterNoteDuration } from "@/musicCalc";
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
      ["C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      ["C4", "F4", "A4"],
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      ["C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      ["B3", "D4", "G4"],
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      ["C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickProg2() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    piano.triggerAttackRelease(
      ["C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      ["Bb3", "C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      ["A3", "C4", "F4"],
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      ["B3", "D4", "G4"],
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      ["C4", "E4", "G4"],
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickProg3() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    piano.triggerAttackRelease(
      ["A3", "C4", "E4"],
      `${quarter}`,
      now + quarter * 0
    );
    piano.triggerAttackRelease(
      ["F3", "A3", "C4"],
      `${quarter}`,
      now + quarter * 1
    );
    piano.triggerAttackRelease(
      ["G3", "B3", "D4"],
      `${quarter}`,
      now + quarter * 2
    );
    piano.triggerAttackRelease(
      ["E3", "G#3", "B3"],
      `${quarter}`,
      now + quarter * 3
    );
    piano.triggerAttackRelease(
      ["A3", "C4", "E4"],
      `${quarter}`,
      now + quarter * 4
    );
  }

  function clickScale() {
    if (!piano) return;

    const now = Tone.now();
    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    const notes = [
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "B4",
      "C5",
      "D5",
      "E5",
      "F5",
      "G5",
      "A5",
      "B5",
      "C6",
    ];
    for (let i = 0; i < notes.length; i++) {
      piano.triggerAttackRelease(
        notes[i],
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
