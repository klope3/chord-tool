"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Tone from "tone";
import {
  bpmToQuarterNoteDuration,
  getAbsIndexSequence,
  getPlayablePitch,
  majorFourth,
  majorThird,
  minorThird,
} from "./musicCalc";

type AppContextType = {
  chords: number[][]; //each chord is an array of absolute pitch indices
  playChords: () => void;
  currentlyPlayingIndex: number;
  currentlyPlaying: boolean;
};

const initialChords = [
  getAbsIndexSequence("C4", [majorThird, minorThird]),
  getAbsIndexSequence("C4", [majorFourth, majorThird]),
  getAbsIndexSequence("C4", [majorThird, minorThird]),
  getAbsIndexSequence("B3", [minorThird, majorFourth]),
  getAbsIndexSequence("C4", [majorThird, minorThird]),
];

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("Null context.");

  return context;
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const [chords, setChords] = useState(initialChords);
  const [piano, setPiano] = useState(
    null as Tone.Sampler | Tone.PolySynth | null
  );
  const [tempoBpm, setTempoBpm] = useState(60);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);

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

  function playChords() {
    if (!piano) return;

    const quarter = bpmToQuarterNoteDuration(tempoBpm);
    setCurrentlyPlaying(true);
    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      if (!chord) break;

      const pitches = chord.map((absIndex) => getPlayablePitch(absIndex));
      const playFn = (i: number) => {
        setCurrentlyPlayingIndex(i);
        piano.triggerAttackRelease(pitches, `${quarter}`);
      };

      if (i === 0) playFn(0);
      else
        setTimeout(() => {
          playFn(i);
        }, quarter * i * 1000);
    }
    setTimeout(() => {
      setCurrentlyPlaying(false);
    }, quarter * chords.length * 1000);
  }

  return (
    <AppContext.Provider
      value={{ chords, playChords, currentlyPlaying, currentlyPlayingIndex }}
    >
      {children}
    </AppContext.Provider>
  );
}
