// The music math behind discerning the pitch using MIDI...
/*
pitch.js turns a frequency into a note and how far the note is off from its expected value in cents.
- the midi note number (which is the idea that every piano key has a value) we used A4 which is 69 in MIDI
and 440 Hz as the value below as that is the main tuning A.
- cents: so a single half step is 100 cents, +18 cents around a note means its sharp and -18 means its flat.
- equal temperament: the piano's tuning, where every half step multiplies the
  frequency by the same amount (the 12th root of 2, about 1.0595).
*/
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// converts a frequency in hertz into a MIDI note number that keeps its decimals.
// for instance 146.9 Hz would be 50.0 which is D3. 186.9 Hz → 54.18 (F♯3, 18 cents sharp).
export function midiNumberFromFrequency(frequencyHz) {
    return 69 + 12 * Math.log2(frequencyHz/440);
}

// fractional MIDI so the nearest note name and how many cents off it is
export function describeMidiNumber(midiNumber) {
    const nearestNoteNumber = Math.round(midiNumber);
    const noteName = NOTE_NAMES[((nearestNoteNumber%12) + 12) % 12];
    const octaveNumber = Math.floor(nearestNoteNumber/12) - 1;
    const centsFromNearestNote = Math.round(100 * (midiNumber - nearestNoteNumber));
    return {noteLabel: `${noteName}${octaveNumber}`, nearestNoteNumber, centsFromNearestNote};
}

// within 15 cents either way counts as it being in tune beyond that +15 is sharp and -15 is flat.
export const IN_TUNE_CENTS = 15;

// determinign if it is in tune, sharp or flat
export function tuningCategory(cents) {
    if(Math.abs(cents) <= IN_TUNE_CENTS) return "in tune";
    return cents > 0 ? "sharp" : "flat";
}