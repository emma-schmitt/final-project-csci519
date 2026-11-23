// main.js: connects the page (index.html) to the listening (listen.js) and the music math (pitch.js)
// finds the page elements by their id, starts listening when the mic button is clicked or play is pressed on a recording,
// and for every reading (about 60 times a second) shows the note and how many cents off it is

import "./style.css";
import { listenToMicrophone, listenToVideo } from "./listen.js";
import { midiNumberFromFrequency, describeMidiNumber } from "./pitch.js";

// readings under either of these count as "no clear note" (tune these for your mic)
const MINIMUM_CLARITY = 0.9; // 0 to 1, how clearly the sound has one pitch
const MINIMUM_VOLUME = 0.01; // anything under this is silence

// finding each page element by its id (the # means the element with this id)
const startMicrophoneButton = document.querySelector("#start-microphone-button");
const recordingFileInput = document.querySelector("#recording-file-input");
const performanceVideo = document.querySelector("#performance-video");
const noteNameDisplay = document.querySelector("#detected-note-name");
const centsDisplay = document.querySelector("#cents-from-nearest-note");
const soundDetailsDisplay = document.querySelector("#sound-details");

// live playing: start the mic when the button is clicked
startMicrophoneButton.addEventListener("click", async () => {
  startMicrophoneButton.disabled = true;
  recordingFileInput.disabled = true; // one source at a time!
  startMicrophoneButton.textContent = "Listening…";
  try {
    await listenToMicrophone(showReading);
  } catch (error) {
    // usually the mic permission was denied or no mic was found
    startMicrophoneButton.disabled = false;
    recordingFileInput.disabled = false;
    startMicrophoneButton.textContent = "Play into your Microphone"; // back to the button's original text
    soundDetailsDisplay.textContent = `Couldn't open the microphone: ${error.message}`;
  }
});

// a recording: when a file is picked, load it into the video player and show the player
recordingFileInput.addEventListener("change", () => {
  const chosenFile = recordingFileInput.files[0];
  if (!chosenFile) return;
  performanceVideo.src = URL.createObjectURL(chosenFile); // gives the browser a temporary address for the file on your computer
  performanceVideo.hidden = false;
  soundDetailsDisplay.textContent = "Press play on the video to start the analysis.";
});

// the analysis starts when play is pressed (that click also lets the browser turn sound on)
performanceVideo.addEventListener("play", async () => {
  startMicrophoneButton.disabled = true; // one source at a time!
  await listenToVideo(performanceVideo, showReading);
});

// if the browser can't play the file (some phone video formats) say so
performanceVideo.addEventListener("error", () => {
  soundDetailsDisplay.textContent = "This file can't be played here. Try exporting it as an MP4 or an audio file.";
});

// runs for every reading from listen.js and updates what's on the screen
function showReading({ frequencyHz, clarity, volume }) {
  soundDetailsDisplay.textContent = `${frequencyHz.toFixed(1)} Hz · clarity ${clarity.toFixed(2)} · volume ${volume.toFixed(3)}`;
  if (clarity < MINIMUM_CLARITY || volume < MINIMUM_VOLUME) { // silence or noise: don't guess a note
    noteNameDisplay.textContent = "–";
    centsDisplay.textContent = "";
    return;
  }
  const { noteLabel, centsFromNearestNote } = describeMidiNumber(midiNumberFromFrequency(frequencyHz));
  noteNameDisplay.textContent = noteLabel;
  const sign = centsFromNearestNote > 0 ? "+" : ""; // a + in front of sharp notes so +18 and -18 are easy to tell apart
  centsDisplay.textContent = `${sign}${centsFromNearestNote} cents`;
}