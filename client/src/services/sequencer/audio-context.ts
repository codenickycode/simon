import * as Tone from "tone";

/** Due to auto-play policy on chrome, the audio context can only be started on
 * a user interaction. These events are considered a user interaction. */
export const startAudioContext = async () => {
  await Tone.start();
  console.log("audio is ready");
  document.removeEventListener("keydown", startAudioContext);
  document.removeEventListener("touchend", startAudioContext);
  document.removeEventListener("click", startAudioContext);
  audioCtxReadyResolver(0);
};

document.addEventListener("keydown", startAudioContext);
document.addEventListener("touchend", startAudioContext);
document.addEventListener("click", startAudioContext);

let audioCtxReadyResolver: (value: unknown) => void;
export const audioCtxReady = new Promise(
  (res) => (audioCtxReadyResolver = res)
);
