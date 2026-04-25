const lessons = [
  {
    id: "1.1",
    title: "Modes of Major Scale",
    category: "Scales",
    targetBpm: 80,
    pages: [
      {
        heading: "Modes of the Major Scale",
        body: "Practice all seven modes from the same parent major scale. Start slowly and name the mode before you play.",
        tab: `C Ionian / Major
e|-----------------7-8-|
B|-------------8-10----|
G|-------7-9-10--------|
D|-7-9-10--------------|
A|---------------------|
E|---------------------|

Fingering:
D string: 1-3-4
G string: 1-3-4
B string: 2-4
e string: 1-2`
      },
      {
        heading: "Mode List",
        body: "Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian.",
        tab: `Formula reference:
Ionian:     1 2 3 4 5 6 7
Dorian:     1 2 b3 4 5 6 b7
Phrygian:   1 b2 b3 4 5 b6 b7
Lydian:     1 2 3 #4 5 6 7
Mixolydian: 1 2 3 4 5 6 b7
Aeolian:    1 2 b3 4 5 b6 b7
Locrian:    1 b2 b3 4 b5 b6 b7`
      }
    ]
  },
  {
    id: "1.2",
    title: "Arpeggios",
    category: "Harmony / Technique",
    targetBpm: 70,
    pages: [
      {
        heading: "Basic Arpeggios",
        body: "Play chord tones only. Keep the sound clean and even.",
        tab: `Cmaj7 arpeggio
e|-----------------7-|
B|-------------8-----|
G|---------9---------|
D|----10-------------|
A|-10----------------|
E|-------------------|

Notes: C E G B
Fingering: 2 / 3 / 2 / 1 / 1`
      }
    ]
  },
  {
    id: "1.3",
    title: "Sequences in 3, 4, 5",
    category: "Technique",
    targetBpm: 70,
    pages: [
      {
        heading: "Sequences in 3",
        body: "Play three-note groups through the scale. Accent the first note of each group.",
        tab: `C major sequence in 3s
e|--------------------------------|
B|--------------------------------|
G|---------------------7-9-10-----|
D|----------7-9-10-7-9------------|
A|-7-8-10-8-----------------------|
E|--------------------------------|`
      },
      {
        heading: "Sequences in 4 and 5",
        body: "Use the same idea with four-note and five-note groupings.",
        tab: `Sequence logic:
3s: 123 234 345 456
4s: 1234 2345 3456
5s: 12345 23456 34567`
      }
    ]
  },
  {
    id: "4.1",
    title: "Triads",
    category: "Chords",
    targetBpm: 60,
    pages: [
      {
        heading: "Triads",
        body: "Major, minor, diminished and augmented triads across string sets.",
        tab: `C major triad, top strings
e|-8-|
B|-8-|
G|-9-|
D|---|
A|---|
E|---|

Notes: G C E
Fingering: 1 / 1 / 2`
      }
    ]
  },
  {
    id: "5.1",
    title: "Septachords Drop 2",
    category: "Jazz / Voicings",
    targetBpm: 60,
    pages: [
      {
        heading: "Septachords Drop 2",
        body: "Take a closed seventh chord and drop the second highest note down one octave.",
        tab: `Cmaj7 drop 2 example
e|-7-|
B|-8-|
G|-9-|
D|-9-|
A|---|
E|---|

Notes: E B C G`
      }
    ]
  },
  {
    id: "6.1",
    title: "Septachords Drop 3",
    category: "Jazz / Voicings",
    targetBpm: 60,
    pages: [
      {
        heading: "Septachords Drop 3",
        body: "Take a closed seventh chord and drop the third highest note down one octave.",
        tab: `Cmaj7 drop 3 example
e|-7-|
B|-8-|
G|-9-|
D|---|
A|-10|
E|---|

Notes: C E B G`
      }
    ]
  }
];

let currentLessonIndex = null;
let currentPageIndex = 0;

const app = document.getElementById("app");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

const bpmInput = document.getElementById("bpmInput");
const bpmSlider = document.getElementById("bpmSlider");
const metroToggle = document.getElementById("metroToggle");

let audioContext = null;
let timerId = null;
let isPlaying = false;

function getProgress() {
  return JSON.parse(localStorage.getItem("guitarPracticeProgress") || "{}");
}

function saveProgress(progress) {
  localStorage.setItem("guitarPracticeProgress", JSON.stringify(progress));
}

function syncBpm(value) {
  const bpm = Math.max(30, Math.min(240, Number(value) || 80));
  bpmInput.value = bpm;
  bpmSlider.value = bpm;

  if (currentLessonIndex !== null) {
    const lesson = lessons[currentLessonIndex];
    const progress = getProgress();
    progress[lesson.id] = progress[lesson.id] || {};
    progress[lesson.id].lastBpm = bpm;
    saveProgress(progress);
  }

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
}

bpmInput.addEventListener("input", e => syncBpm(e.target.value));
bpmSlider.addEventListener("input", e => syncBpm(e.target.value));

function clickSound(accent = false) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.frequency.value = accent ? 1200 : 850;
  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.4, audioContext.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.07);
}

function startMetronome() {
  audioContext = audioContext || new AudioContext();
  isPlaying = true;
  metroToggle.textContent = "Stop";

  let beat = 0;
  clickSound(true);

  const interval = 60000 / Number(bpmInput.value);
  timerId = setInterval(() => {
    beat = (beat + 1) % 4;
    clickSound(beat === 0);
  }, interval);
}

function stopMetronome() {
  isPlaying = false;
  metroToggle.textContent = "Start";
  clearInterval(timerId);
  timerId = null;
}

metroToggle.addEventListener("click", () => {
  if (isPlaying) stopMetronome();
  else startMetronome();
});

function renderHome() {
  currentLessonIndex = null;
  currentPageIndex = 0;

  const progress = getProgress();

  app.innerHTML = `
    <section class="card">
      <h1>Guitar Practice</h1>
      <p class="meta">Select a lesson. The metronome stays fixed at the top.</p>
    </section>

    <section>
      ${lessons.map((lesson, index) => {
        const p = progress[lesson.id] || {};
        const status = p.completed ? "Completed" : "Not completed";
        const best = p.bestBpm ? `Best BPM: ${p.bestBpm}` : `Target BPM: ${lesson.targetBpm}`;
        return `
          <button class="lesson-button" onclick="openLesson(${index}, 0)">
            <span class="lesson-id">${lesson.id}</span>
            <strong>${lesson.title}</strong>
            <div class="meta">${lesson.category} · ${status} · ${best}</div>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function openLesson(lessonIndex, pageIndex = 0) {
  currentLessonIndex = lessonIndex;
  currentPageIndex = pageIndex;

  const lesson = lessons[lessonIndex];
  const progress = getProgress();
  const saved = progress[lesson.id] || {};

  syncBpm(saved.lastBpm || lesson.targetBpm);
  renderLesson();
}

function renderLesson() {
  const lesson = lessons[currentLessonIndex];
  const page = lesson.pages[currentPageIndex];
  const progress = getProgress();
  const saved = progress[lesson.id] || {};

  app.innerHTML = `
    <section class="card">
      <div class="meta">${lesson.id} · ${lesson.category} · Page ${currentPageIndex + 1} of ${lesson.pages.length}</div>
      <h1>${lesson.title}</h1>
      <h2>${page.heading}</h2>
      <p>${page.body}</p>
    </section>

    <section class="card">
      <h3>Tab / Fingering</h3>
      <div class="tab-box"><pre>${page.tab}</pre></div>
    </section>

    <section class="card">
      <h3>Practice Progress</h3>
      <div class="progress-grid">
        <button class="primary" onclick="markComplete()">Mark Complete</button>
        <button onclick="saveBestBpm()">Save Current BPM as Best</button>
      </div>
      <p class="meta">Best BPM: ${saved.bestBpm || "—"} · Completed: ${saved.completed ? "Yes" : "No"}</p>
      <textarea id="lessonNotes" placeholder="Practice notes...">${saved.notes || ""}</textarea>
      <button onclick="saveNotes()">Save Notes</button>
    </section>
  `;
}

function markComplete() {
  const lesson = lessons[currentLessonIndex];
  const progress = getProgress();
  progress[lesson.id] = progress[lesson.id] || {};
  progress[lesson.id].completed = true;
  progress[lesson.id].lastPracticed = new Date().toISOString().slice(0, 10);
  saveProgress(progress);
  renderLesson();
}

function saveBestBpm() {
  const lesson = lessons[currentLessonIndex];
  const progress = getProgress();
  progress[lesson.id] = progress[lesson.id] || {};
  progress[lesson.id].bestBpm = Number(bpmInput.value);
  progress[lesson.id].lastPracticed = new Date().toISOString().slice(0, 10);
  saveProgress(progress);
  renderLesson();
}

function saveNotes() {
  const lesson = lessons[currentLessonIndex];
  const progress = getProgress();
  progress[lesson.id] = progress[lesson.id] || {};
  progress[lesson.id].notes = document.getElementById("lessonNotes").value;
  saveProgress(progress);
  renderLesson();
}

function nextPage() {
  if (currentLessonIndex === null) return;

  const lesson = lessons[currentLessonIndex];

  if (currentPageIndex < lesson.pages.length - 1) {
    currentPageIndex++;
    renderLesson();
    window.scrollTo(0, 0);
    return;
  }

  if (currentLessonIndex < lessons.length - 1) {
    openLesson(currentLessonIndex + 1, 0);
    window.scrollTo(0, 0);
    return;
  }

  renderHome();
}

function previousPage() {
  if (currentLessonIndex === null) return;

  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderLesson();
    window.scrollTo(0, 0);
    return;
  }

  if (currentLessonIndex > 0) {
    const previousLesson = lessons[currentLessonIndex - 1];
    openLesson(currentLessonIndex - 1, previousLesson.pages.length - 1);
    window.scrollTo(0, 0);
    return;
  }

  renderHome();
}

nextBtn.addEventListener("click", nextPage);
backBtn.addEventListener("click", previousPage);
homeBtn.addEventListener("click", renderHome);

renderHome();
