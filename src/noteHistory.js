// noteHistory.js: this is the list of every note on the page, it fills in with a little box for each note while the video plays
/*
- each little box has the note name, a tiny scale and alsop the cents: the center line is the correct pitch and the pitch that should be and the dot is
  what was played (left of line = flat, right of line = sharp)
- the last box has a dashed border while that note is still being played, so you can watch its dot move as you adjust
- click any of the boxes to see its details, and for videos a button to play that moment again
*/

import { tuningCategory, frequencyFromMidi } from "./pitch.js";

// so 21 -> +21 and -7 -> -7
export function signedCents(cents) {
    return `${cents > 0 ? "+" : ""}${cents}`;
}

// seconds is m:ss so like 75 -> 1:15
export function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${Strings(secs).padStart(2, "0")}`;
}

// what goes inside of one of the boxes so it incldues the note name the tiny scale with the dot and the cents
function boxContent(note) {
    const dotX = 26 + note.cents * 0.44;
     return `<span>${note.noteLabel}</span>
        <svg width="52" height="14" viewBox="0 0 52 14" aria-hidden="true">
            <line class="chip-scale" x1="4" x2="48" y1="7" y2="7" />
            <line class="chip-center" x1="26" x2="26" y1="2" y2="12" />
            <circle class="chip-dot" cx="${dotX}" cy="7" r="3.5" />
        </svg>
        <span class="chip-cents">${signedCents(note.cents)}</span>`;
}


export class NoteHistory {
    // boxArea is where the boc goes adn the detailArewa is where the clicked notes details goes
    // playNoteAgain a function that replays a note in the video
    constructor(boxArea, detailArea, playNoteAgain) {
        this.boxArea = boxArea;
        this.detailArea = detailArea;
        this.playNoteAgain = playNoteAgain;
        this.selectedBox = null;
        this.boxArea.innerHTML = ""; // start empty for each new session
        this.detailArea.innerHTML = "";
        // one extra box that always stays at the end
        this.inProgressBox = document.createElement("div");
        this.inProgressBox.className = "note-box in-progress";
        this.inProgressBox,hidden = true;
        this.boxArea.append(this.inProgressBox);
    }

        // a note just ended: add its box just before the in-progress box, and scroll so the newest boxes stay in view
    addNote(note) {
        
    }

    // the note being played right now (or null): redraws the dashed box at the end, about 60 times a second
    showNoteInProgress(note) {
        
    }

    // clicking a box: highlight it and show its details underneath
    showNoteDetail(note, chip) {
        
        }
    }
}