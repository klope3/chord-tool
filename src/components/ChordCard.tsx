"use client";

import { absPitchIndexToPitchData } from "@/musicCalc";
import styles from "@/styles/ChordCard.module.css";

type Props = {
  pitchIndices: number[];
  isCurrentlyPlaying?: boolean;
};
export default function ChordCard({ pitchIndices, isCurrentlyPlaying }: Props) {
  const pitchData = pitchIndices.map((index) =>
    absPitchIndexToPitchData(index)
  );
  const sorted = pitchData.sort((a, b) => b.absoluteIndex - a.absoluteIndex);

  return (
    <div
      className={`${styles["main"]} ${
        isCurrentlyPlaying ? styles["currently-playing"] : ""
      }`}
    >
      {sorted.map((data) => {
        const names = [
          data.pitchEquivalentGroup.flat,
          data.pitchEquivalentGroup.natural,
          data.pitchEquivalentGroup.sharp,
        ]
          .filter((item) => item !== undefined)
          .map((item) => item?.name);

        return <div>{names.join("/")}</div>;
      })}
    </div>
  );
}
