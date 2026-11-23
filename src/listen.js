// listen.js: taking in the sound (mic or a recording) and performing pitch detection
// how the sound flows: sound source (mic or video) -> analyser (keeps the latest 2048 samples)
// -> pitchy (finds the pitch) -> onReading (main.js shows it on the screen)
// a sample is one number for the sound wave at one moment, between -1 and 1 (about 48,000 every second)

import * as Tone from "tone"; // tone.js is the toolkit for working with sound in the browser
import {PitchDetector} from "pitchy"; // pitchy finds the pitch of the sound (mcleod's method)

const SAMPLES_PER_READING = 2048; // so this is the samples per reading so about every 43 mili seconds of sound it is sampled
let sharedAnalyser = null; // shared by every one of the sound sources, made the first time it is needed
let videoSoundConnection = null; // the link from the video player into the sound system, can only be made once

// start measuring the loop once so any sound source if that is from the recording or the mic plugs into the same analyser
async function getSharedAnalyser(onReading) {
    await Tone.start(); // so only allow audio after the button has been clicked
    if (sharedAnalyser) return sharedAnalyser; // already made, so just hand it back

    sharedAnalyser = new Tone.Analyser("waveform", SAMPLES_PER_READING); // waveform means keep the raw samples
    const pitchDetector = PitchDetector.forFloat32Array(SAMPLES_PER_READING);
    const samplesPerSecond = Tone.getContext().sampleRate; // usually 48,000 or 44,100

    function takeReading() {
        const waveformSamples = sharedAnalyser.getValue(); // so the buffer is the latest 2048 samples each is between -1 and 1
        const [frequencyHz, clarity] = pitchDetector.findPitch(waveformSamples, samplesPerSecond); // clarity is 0 to 1, close to 1 means a clean steady note
        // volume: square every sample so the negatives count too, average them, then square root
        let sumOfSquares = 0;
        for (const sample of waveformSamples) sumOfSquares += sample * sample;
        const volume = Math.sqrt(sumOfSquares / waveformSamples.length); // this is the volume, 0 is silence
        onReading({timeSeconds: Tone.immediate(), frequencyHz, clarity, volume}); // send the reading to main.js, the time is for wait mode later
        requestAnimationFrame(takeReading); // run again on the next screen refresh it refreshes about 60 times a second
    }
    takeReading();
    return sharedAnalyser;
}

export async function listenToMicrophone(onReading) {
    const analyser = await getSharedAnalyser(onReading);
    // switch off the browsers call style processing because noise suppression can erase longer notes
    // and auto gain would even out the volume and hide uneven bowing from the tone ring
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: {echoCancellation: false, noiseSuppression: false, autoGainControl: false},
    });
    const microphoneSoundSource = Tone.getContext().createMediaStreamSource(microphoneStream);
    Tone.connect(microphoneSoundSource, analyser); // only measured, not sent to the speakers so no feedback
}

// a recording: takes the sound coming out of the video player (works for audio files too)
export async function listenToVideo(videoElement, onReading) {
    const analyser = await getSharedAnalyser(onReading);
    // the video player can only be linked into the sound system once, so only do it the first time
    // picking a new file later just changes what the same video player plays
    if (!videoSoundConnection) {
        videoSoundConnection = Tone.getContext().createMediaElementSource(videoElement);
        Tone.connect(videoSoundConnection, analyser); // measure it
        Tone.connect(videoSoundConnection, Tone.getDestination()); // making sure you can still hear it
    }
}