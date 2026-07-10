let audioCtx = null;
let lastDogSoundAt = 0;
let lastFallSoundAt = 0;

function initAudio(){
  if(!audioCtx){
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if(!AudioContextClass) return;
    audioCtx = new AudioContextClass();
  }

  if(audioCtx.state === "suspended"){
    audioCtx.resume();
  }
}

function playCuteDogSound(strength=1, delay=0, pitch=1, force=false){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;
  const startAt = now + delay;

  if(!force && now - lastDogSoundAt < 0.06) return;
  lastDogSoundAt = startAt;

  const voice = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  voice.type = "sine";
  voice.frequency.setValueAtTime(520 * pitch, startAt);
  voice.frequency.exponentialRampToValueAtTime(760 * pitch, startAt + 0.03);
  voice.frequency.exponentialRampToValueAtTime(480 * pitch, startAt + 0.1);
  voice.frequency.exponentialRampToValueAtTime(620 * pitch, startAt + 0.16);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400 * Math.max(0.8, pitch), startAt);
  filter.Q.setValueAtTime(0.9, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.22 * strength, startAt + 0.014);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);

  voice.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  voice.start(startAt);
  voice.stop(startAt + 0.2);
}

function playRealisticCatMeow(strength=1, delay=0, duration=0.34, pitch=1.2){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;
  const startAt = now + delay;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  const baseFreq = 620 + Math.random() * 40;

  osc.type = "sine";
  osc.frequency.setValueAtTime(baseFreq * pitch, startAt);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * pitch * 0.84, startAt + duration * 0.35);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * pitch * 0.9, startAt + duration);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1700, startAt);
  filter.Q.setValueAtTime(0.7, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.16 * strength, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration + 0.02);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

function playShortCatMeow(strength=1, delay=0, pitch=1.7){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;
  const startAt = now + delay;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(760 * pitch, startAt);
  osc.frequency.exponentialRampToValueAtTime(920 * pitch, startAt + 0.018);
  osc.frequency.exponentialRampToValueAtTime(690 * pitch, startAt + 0.07);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2200, startAt);
  filter.Q.setValueAtTime(0.8, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.18 * strength, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.09);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startAt);
  osc.stop(startAt + 0.09);
}

function playFallSound(){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;

  if(now - lastFallSoundAt < 0.08) return;
  lastFallSoundAt = now;

  playCuteDogSound(0.85, 0, 1.2, true);
}

function playDogPartySound(chainCount, clearedCount){
  const meows = Math.min(24, 10 + chainCount * 2 + Math.floor(clearedCount / 2));
  const pattern = [
    {delay:0.00, strength:0.8, pitch:1.25},
    {delay:0.03, strength:0.76, pitch:1.35},
    {delay:0.06, strength:0.82, pitch:1.45},
    {delay:0.09, strength:0.78, pitch:1.55},
    {delay:0.12, strength:0.84, pitch:1.3},
    {delay:0.15, strength:0.8, pitch:1.4},
    {delay:0.18, strength:0.77, pitch:1.5},
    {delay:0.21, strength:0.83, pitch:1.6},
    {delay:0.24, strength:0.79, pitch:1.35},
    {delay:0.27, strength:0.81, pitch:1.45},
    {delay:0.30, strength:0.78, pitch:1.55},
    {delay:0.33, strength:0.85, pitch:1.65},
    {delay:0.36, strength:0.8, pitch:1.4},
    {delay:0.39, strength:0.76, pitch:1.5},
    {delay:0.42, strength:0.82, pitch:1.6},
    {delay:0.45, strength:0.84, pitch:1.7},
    {delay:0.48, strength:0.79, pitch:1.45},
    {delay:0.51, strength:0.81, pitch:1.55},
    {delay:0.54, strength:0.77, pitch:1.65},
    {delay:0.57, strength:0.83, pitch:1.75},
    {delay:0.60, strength:0.8, pitch:1.5},
    {delay:0.63, strength:0.78, pitch:1.6},
    {delay:0.66, strength:0.82, pitch:1.7},
    {delay:0.69, strength:0.85, pitch:1.8}
  ];

  for(let i=0;i<meows;i++){
    const meow = pattern[i];
    playShortCatMeow(meow.strength, meow.delay, meow.pitch);
  }
}

function playGameOverMusic(){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;
  const melody = [
    {time:0, freq:660, length:0.18},
    {time:0.18, freq:560, length:0.18},
    {time:0.36, freq:470, length:0.24},
    {time:0.62, freq:350, length:0.36},
    {time:1.02, freq:260, length:0.55}
  ];

  melody.forEach(note=>{
    const startAt = now + note.time;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.freq, startAt);
    osc.frequency.exponentialRampToValueAtTime(note.freq * 0.88, startAt + note.length);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, startAt);
    filter.frequency.exponentialRampToValueAtTime(650, startAt + note.length);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.2, startAt + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + note.length);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startAt);
    osc.stop(startAt + note.length + 0.03);
  });

  const bass = audioCtx.createOscillator();
  const bassGain = audioCtx.createGain();

  bass.type = "sine";
  bass.frequency.setValueAtTime(130, now + 0.58);
  bass.frequency.exponentialRampToValueAtTime(82, now + 1.55);

  bassGain.gain.setValueAtTime(0.0001, now + 0.58);
  bassGain.gain.exponentialRampToValueAtTime(0.16, now + 0.68);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);

  bass.connect(bassGain);
  bassGain.connect(audioCtx.destination);

  bass.start(now + 0.58);
  bass.stop(now + 1.7);
}

function playVictoryGameOverMusic(){
  if(!audioCtx) return;

  const now = audioCtx.currentTime;
  const melody = [
    {time:0, freq:523.25, length:0.16},
    {time:0.15, freq:659.25, length:0.16},
    {time:0.3, freq:783.99, length:0.18},
    {time:0.47, freq:1046.5, length:0.24},
    {time:0.72, freq:987.77, length:0.16},
    {time:0.87, freq:1174.66, length:0.18},
    {time:1.04, freq:1318.51, length:0.42}
  ];

  melody.forEach((note, index)=>{
    const startAt = now + note.time;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = index % 2 === 0 ? "triangle" : "square";
    osc.frequency.setValueAtTime(note.freq, startAt);
    osc.frequency.exponentialRampToValueAtTime(note.freq * 1.04, startAt + note.length);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, startAt);
    filter.frequency.exponentialRampToValueAtTime(1900, startAt + note.length);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + note.length);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startAt);
    osc.stop(startAt + note.length + 0.03);
  });

  const chordNotes = [523.25, 659.25, 783.99, 1046.5];

  chordNotes.forEach((freq, index)=>{
    const startAt = now + 1.42 + index * 0.025;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.11, startAt + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startAt);
    osc.stop(startAt + 0.85);
  });

  playCuteDogSound(0.85, 0.18, 1.6, true);
  playCuteDogSound(0.8, 0.38, 1.8, true);
  playCuteDogSound(0.9, 0.62, 1.7, true);
  playCuteDogSound(0.85, 1.0, 1.9, true);
}
