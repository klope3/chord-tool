"use client";

import { useEffect, useState } from "react";
import * as Tone from "tone";

export function InstrumentPlayer() {
  const [piano, setPiano] = useState(null as Tone.Sampler | null);

  useEffect(() => {
    async function startAudioContext() {
      await Tone.start();
      console.log("Audio context started");
    }
    startAudioContext();

    setPiano(
      new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination()
    );
  }, []);

  function clickPiano() {
    if (!piano) return;

    const now = Tone.now();
    piano.triggerAttackRelease(["C4", "E4", "G4"], "1", now);
    piano.triggerAttackRelease(["C4", "F4", "A4"], "1", now + 1);
    piano.triggerAttackRelease(["C4", "E4", "G4"], "1", now + 2);
    piano.triggerAttackRelease(["B3", "D4", "G4"], "1", now + 3);
    piano.triggerAttackRelease(["C4", "E4", "G4"], "1", now + 4);
  }

  function clickScale() {
    if (!piano) return;

    const now = Tone.now();
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
      piano.triggerAttackRelease(notes[i], "0.25", now + 0.25 * i);
    }
    piano.triggerAttackRelease("C4", "0.25", now);
  }

  return (
    <div>
      <button onClick={clickPiano} id="playPianoC">
        Play Chord Progression
      </button>
      <button onClick={clickScale}>Play Scale</button>
    </div>
  );
}

export default InstrumentPlayer;
