// notes.js is meant to track notes, so it groups the readigns every 60 seconds into the different notes played
/* main difficult logic should be in how the program can tell where the notes start/end
*/
const SHORTEST_NOTE_SECONDS = 0.1 // basically anything shorter than this isnt a real note
const SILENCE_SECONDS = 0.15 // this long without a clear reading ends the note
const SKIP_SECONDS = 0.05 // ignore the first 50 ms of a note goal is to make sure that you ignore the first part where the bow is stil trying to catch the string

// finding the median
function median(numbers) {
    const sorted = [...numbers].sort((first, second) => first-second);
    const middleIndex = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) return sorted[middleIndex];
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
}

export class NoteTracker {
// noteFinished is gona be a function that gets called every note the second it ends
constructor(noteFinished) {
    this.noteFinished = noteFinished;
    this.finishedNotes = []; //basically the list of finished tracked notes\
    this.currentNote = null; // every note being played rn
    }
}

// so basically a clear reading comes in either keep adding it to the current note or start a new note
addReading({ }) {
    if (this.currentNote) {
        const isDifferentNote = nearestNote !== this.currentNote.nearestNote;
         const silenceTooLong = timeSeconds - this.currentNote.endTime > SILENCE_SECONDS;
         const wentBackwards = timeSeconds < this.currentNote.endTiem; // skipped back in the video
         if (isDifferentNote || silenceTooLong || wentBackwards) this.finishCurrentNote();
    }
    if(!this.currentNote) {
        this.currentNote = { noteLabel, nearestNote, startTime: timeSeconds, endTime: timeSeconds, centsReading: []};
    }
    this.currentNote.endTime = timeSeconds;
    // only keep teh cents once past the start note
    if(timeSeconds - this.currentNote.startTime >= SKIP_SECONDS) {
        this.currentNote.centsReading.push(centsReading);
    }
}

addSilence() {

}

finishCurrentNote() {

}

currentNoteStatus() {

}