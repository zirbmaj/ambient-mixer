// DRIFT — Ambient Sound Mixer
// Built by Claude & Claudia, 2026
// Audio engine with layered Web Audio API synthesis

// Sound layer definitions
const LAYERS = [
    {
        id: 'rain',
        name: 'Rain',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 3l-2 5M8 2l-2 6M12 3l-2 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
        category: 'weather',
        type: 'sample',
        src: '/audio/rain.mp3',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;
            filter.Q.value = 0.5;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            return { source: noise, gain };
        }
    },
    {
        id: 'heavy-rain',
        name: 'Heavy Rain',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 2l-2 6M6 1l-2 7M9 2l-2 6M12 1l-2 7M15 2l-2 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
        category: 'weather',
        type: 'sample',
        src: '/audio/heavy-rain.mp3',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            filter.Q.value = 0.3;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            return { source: noise, gain };
        }
    },
    {
        id: 'thunder',
        name: 'Thunder',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M9 1L5 8h4l-3 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        category: 'weather',
        type: 'sample',
        src: '/audio/thunder.mp3',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 100;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            // Periodic rumbles
            const rumbleGain = gain;
            function rumble() {
                if (rumbleGain.gain.value > 0) {
                    const now = ctx.currentTime;
                    const intensity = 0.3 + Math.random() * 0.7;
                    rumbleGain.gain.setValueAtTime(rumbleGain.gain.value * 0.3, now);
                    rumbleGain.gain.linearRampToValueAtTime(rumbleGain.gain.value * intensity, now + 0.05);
                    rumbleGain.gain.exponentialRampToValueAtTime(Math.max(rumbleGain.gain.value * 0.3, 0.001), now + 1.5 + Math.random() * 2);
                }
                setTimeout(rumble, 8000 + Math.random() * 20000);
            }
            setTimeout(rumble, 3000);
            return { source: noise, gain };
        }
    },
    {
        id: 'wind',
        name: 'Wind',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 5h10a2 2 0 100-4M1 8h12a2 2 0 110 4M1 11h8a2 2 0 100 4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
        category: 'weather',
        type: 'synthesis',
        create: (ctx, dest) => {
            // Wind: bandpass noise (mid-range whoosh) + slow LFO modulation
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            filter.Q.value = 0.3;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            // LFO for gusty modulation
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.15; // slow gusts
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 150; // modulates filter freq ±150hz
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            return { source: noise, gain, extras: [lfo, lfoGain] };
        }
    },
    {
        id: 'fire',
        name: 'Fireplace',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 1C6 4 3 6 3 10a5 5 0 0010 0c0-4-3-6-5-9z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
        category: 'spaces',
        type: 'sample',
        src: '/audio/fire.mp3',
        create: (ctx, dest) => {
            // Crackle layer (high)
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 2;
            // Body layer (low warmth)
            const noise2 = createNoise(ctx);
            const filter2 = ctx.createBiquadFilter();
            filter2.type = 'lowpass';
            filter2.frequency.value = 300;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 3 + Math.random() * 5;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.3;
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            lfo.start();
            noise.connect(filter);
            filter.connect(gain);
            noise2.connect(filter2);
            filter2.connect(gain);
            gain.connect(dest);
            noise.start();
            noise2.start();
            return { source: noise, gain, extras: [lfo, noise2] };
        }
    },
    {
        id: 'vinyl',
        name: 'Vinyl Crackle',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
        category: 'spaces',
        type: 'synthesis',
        create: (ctx, dest) => {
            // Base crackle
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 4000;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            // Intermittent pops
            function schedulePop() {
                if (gain.gain.value > 0.001) {
                    const popNoise = createNoise(ctx);
                    const popFilter = ctx.createBiquadFilter();
                    popFilter.type = 'bandpass';
                    popFilter.frequency.value = 2000 + Math.random() * 3000;
                    popFilter.Q.value = 5;
                    const popGain = ctx.createGain();
                    const now = ctx.currentTime;
                    popGain.gain.setValueAtTime(0, now);
                    popGain.gain.linearRampToValueAtTime(gain.gain.value * 2, now + 0.002);
                    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    popNoise.connect(popFilter);
                    popFilter.connect(popGain);
                    popGain.connect(dest);
                    popNoise.start();
                    popNoise.stop(now + 0.1);
                }
                setTimeout(schedulePop, 500 + Math.random() * 3000);
            }
            setTimeout(schedulePop, 1000);
            return { source: noise, gain };
        }
    },
    {
        id: 'cafe',
        name: 'Cafe',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 5h9v6a3 3 0 01-3 3H5a3 3 0 01-3-3V5zM11 6h1.5a2 2 0 010 4H11" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
        category: 'spaces',
        type: 'sample',
        src: '/audio/cafe.mp3',
        create: (ctx, dest) => {
            // Layered filtered noise to simulate murmur
            const noise = createNoise(ctx);
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = 400;
            bp.Q.value = 0.8;
            const noise2 = createNoise(ctx);
            const bp2 = ctx.createBiquadFilter();
            bp2.type = 'bandpass';
            bp2.frequency.value = 1200;
            bp2.Q.value = 1.2;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(bp);
            bp.connect(gain);
            noise2.connect(bp2);
            bp2.connect(gain);
            gain.connect(dest);
            noise.start();
            noise2.start();
            return { source: noise, gain, extras: [noise2] };
        }
    },
    {
        id: 'crickets',
        name: 'Crickets',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 12c2-3 4-5 5-8M8 12c1-2 2-4 3-6M13 11c0-2 0-3-1-5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
        category: 'nature',
        type: 'sample',
        src: '/audio/crickets.mp3',
        create: (ctx, dest) => {
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(dest);
            const oscs = [];
            for (let i = 0; i < 4; i++) {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 4000 + Math.random() * 2500;
                const drift = ctx.createOscillator();
                drift.frequency.value = 0.1 + Math.random() * 0.4;
                const driftGain = ctx.createGain();
                driftGain.gain.value = 100 + Math.random() * 150;
                drift.connect(driftGain);
                driftGain.connect(osc.frequency);
                const tremolo = ctx.createOscillator();
                tremolo.frequency.value = 5 + Math.random() * 12;
                const tGain = ctx.createGain();
                tGain.gain.value = 0.006;
                const mGain = ctx.createGain();
                mGain.gain.value = 0.006;
                tremolo.connect(tGain.gain);
                osc.connect(tGain);
                tGain.connect(mGain);
                mGain.connect(gain);
                osc.start();
                tremolo.start();
                drift.start();
                oscs.push(osc, tremolo, drift);
            }
            return { source: oscs[0], gain, extras: oscs.slice(1) };
        }
    },
    {
        id: 'waves',
        name: 'Ocean Waves',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 8c2-3 4-3 6 0s4 3 6 0M1 12c2-3 4-3 6 0s4 3 6 0" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
        category: 'nature',
        type: 'sample',
        src: '/audio/waves.mp3',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 500;
            // Slow wave modulation
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.08;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 400;
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            return { source: noise, gain, extras: [lfo] };
        }
    },
    {
        id: 'drone',
        name: 'Deep Drone',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><ellipse cx="8" cy="8" rx="7" ry="3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
        category: 'textures',
        type: 'synthesis',
        create: (ctx, dest) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 55;
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 82.5;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(dest);
            osc.start();
            osc2.start();
            return { source: osc, gain, extras: [osc2] };
        }
    },
    {
        id: 'brown-noise',
        name: 'Brown Noise',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 8h2l1-3 2 6 2-5 2 4 1-2h4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        category: 'textures',
        type: 'synthesis',
        create: (ctx, dest) => {
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let last = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (last + (0.02 * white)) / 1.02;
                last = data[i];
                data[i] *= 3.5;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            source.connect(gain);
            gain.connect(dest);
            source.start();
            return { source, gain };
        }
    },
    {
        id: 'white-noise',
        name: 'White Noise',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 8h1l1-4 1 6 1-5 1 7 1-6 1 4 1-3 1 5 1-4 1 2h1" stroke="currentColor" stroke-width="1" fill="none" stroke-linejoin="round"/></svg>',
        category: 'textures',
        type: 'synthesis',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(gain);
            gain.connect(dest);
            noise.start();
            return { source: noise, gain };
        }
    },
    {
        id: 'train',
        name: 'Train Cabin',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><rect x="3" y="2" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" stroke-width="1"/><circle cx="5.5" cy="14" r="1" fill="currentColor"/><circle cx="10.5" cy="14" r="1" fill="currentColor"/></svg>',
        category: 'spaces',
        type: 'sample',
        src: '/audio/train.mp3',
        create: (ctx, dest) => {
            // Rhythmic clacking
            const noise = createNoise(ctx);
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = 200;
            bp.Q.value = 0.5;
            // Low rumble
            const noise2 = createNoise(ctx);
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 100;
            // Rhythmic modulation
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 2.2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.15;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            lfo.start();
            noise.connect(bp);
            bp.connect(gain);
            noise2.connect(lp);
            lp.connect(gain);
            gain.connect(dest);
            noise.start();
            noise2.start();
            return { source: noise, gain, extras: [lfo, noise2] };
        }
    },
    {
        id: 'birds',
        name: 'Forest Birds',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 8c2-3 4-2 5 0M10 5c2-3 4-2 5 0M4 12c2-2 3-2 4 0" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
        category: 'nature',
        type: 'sample',
        src: '/audio/birds.mp3',
        create: (ctx, dest) => {
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(dest);
            const oscs = [];
            // Multiple bird-like chirps at different frequencies
            for (let i = 0; i < 5; i++) {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 2000 + Math.random() * 3000;
                const vibrato = ctx.createOscillator();
                vibrato.frequency.value = 4 + Math.random() * 8;
                const vibGain = ctx.createGain();
                vibGain.gain.value = 200 + Math.random() * 400;
                vibrato.connect(vibGain);
                vibGain.connect(osc.frequency);
                const tremolo = ctx.createOscillator();
                tremolo.frequency.value = 0.3 + Math.random() * 0.8;
                const tGain = ctx.createGain();
                tGain.gain.value = 0.004;
                const mGain = ctx.createGain();
                mGain.gain.value = 0.004;
                tremolo.connect(tGain.gain);
                osc.connect(tGain);
                tGain.connect(mGain);
                mGain.connect(gain);
                osc.start();
                vibrato.start();
                tremolo.start();
                oscs.push(osc, vibrato, tremolo);
            }
            return { source: oscs[0], gain, extras: oscs.slice(1) };
        }
    },
    {
        id: 'leaves',
        name: 'Leaves Rustling',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 13C3 7 8 2 14 2c0 6-5 11-11 11zM3 13c3-3 6-5 11-11" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
        category: 'nature',
        type: 'sample',
        src: '/audio/leaves.mp3',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3000;
            filter.Q.value = 0.8;
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.3 + Math.random() * 0.5;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 1500;
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            return { source: noise, gain, extras: [lfo] };
        }
    },
    {
        id: 'snow',
        name: 'Snow Silence',
        icon: '<svg viewBox="0 0 16 16" width="16" height="16"><circle cx="4" cy="4" r="1.2" fill="currentColor" opacity="0.5"/><circle cx="11" cy="6" r="1" fill="currentColor" opacity="0.4"/><circle cx="7" cy="10" r="1.2" fill="currentColor" opacity="0.6"/><circle cx="13" cy="12" r="0.8" fill="currentColor" opacity="0.3"/></svg>',
        category: 'weather',
        type: 'synthesis',
        create: (ctx, dest) => {
            // Warm indoor silence — low filtered noise + furnace hum
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 0.5;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start();
            // Subtle furnace hum
            const hum = ctx.createOscillator();
            hum.type = 'sine';
            hum.frequency.value = 50;
            const humGain = ctx.createGain();
            humGain.gain.value = 0;
            hum.connect(humGain);
            humGain.connect(dest);
            hum.start();
            return { source: noise, gain, extras: [hum, humGain] };
        }
    },
];

// Layer pairing suggestions (Claudia's curation)
const LAYER_PAIRS = {
    'rain': ['cafe', 'vinyl', 'thunder'],
    'heavy-rain': ['thunder', 'wind', 'drone'],
    'thunder': ['rain', 'heavy-rain', 'wind'],
    'wind': ['leaves', 'snow', 'fire'],
    'fire': ['snow', 'vinyl', 'wind'],
    'vinyl': ['rain', 'fire', 'cafe'],
    'cafe': ['rain', 'vinyl'],
    'train': ['rain', 'drone'],
    'crickets': ['waves', 'drone', 'birds'],
    'waves': ['crickets', 'drone'],
    'birds': ['leaves', 'wind', 'crickets'],
    'leaves': ['birds', 'wind'],
    'drone': ['rain', 'waves', 'train'],
    'brown-noise': ['rain', 'drone'],
    'white-noise': [],
    'snow': ['fire', 'wind'],
};

function updateSuggestions() {
    // Clear all suggestions
    document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('suggested'));

    // Find active layers
    const active = Object.entries(layerStates).filter(([_, s]) => s.active).map(([id]) => id);
    if (active.length === 0) return;

    // Collect suggested layers
    const suggested = new Set();
    active.forEach(id => {
        (LAYER_PAIRS[id] || []).forEach(s => {
            if (!active.includes(s)) suggested.add(s);
        });
    });

    // Apply subtle glow
    suggested.forEach(id => {
        const card = document.getElementById(`layer-${id}`);
        if (card) card.classList.add('suggested');
    });
}

// Now Playing indicator
// Hidden messages for curious explorers
const EASTER_EGGS = {
    // Single layer at 100%
    solo: {
        'rain': 'sometimes one sound is enough',
        'fire': 'stare into it long enough and it stares back',
        'cafe': 'the best conversations are the ones you overhear',
        'drone': 'the universe hums at 55 hertz. now you know',
    },
    // Specific combinations
    combos: [
        { layers: ['rain', 'fire'], msg: 'the impossible room' },
        { layers: ['rain', 'cafe', 'vinyl'], msg: 'sunday morning, nowhere in particular' },
        { layers: ['snow', 'fire'], msg: 'the cabin exists. you just found it' },
        { layers: ['birds', 'crickets'], msg: 'dawn and dusk at the same time' },
        { layers: ['train', 'rain'], msg: 'going somewhere. not sure where. that\'s okay' },
        { layers: ['waves', 'wind'], msg: 'the edge of the world sounds like this' },
        { layers: ['brown-noise', 'white-noise'], msg: 'the space between frequencies' },
        { layers: ['vinyl', 'drone'], msg: 'a record player in an abandoned church' },
        { layers: ['thunder', 'fire'], msg: 'the storm is outside. you are not' },
        { layers: ['leaves', 'birds', 'wind'], msg: 'a forest that only exists in headphones' },
    ],
};

function checkEasterEgg(active) {
    // Check solo at 100%
    if (active.length === 1) {
        const id = active[0].id;
        const slider = document.getElementById(`slider-${id}`);
        if (slider && parseInt(slider.value) === 100 && EASTER_EGGS.solo[id]) {
            return EASTER_EGGS.solo[id];
        }
    }
    // Check combos
    const ids = active.map(l => l.id).sort();
    for (const combo of EASTER_EGGS.combos) {
        const sorted = [...combo.layers].sort();
        if (ids.length === sorted.length && ids.every((id, i) => id === sorted[i])) {
            return combo.msg;
        }
    }
    return null;
}

function updateNowPlaying() {
    const bar = document.getElementById('now-playing-bar');
    const label = document.getElementById('np-layers');
    if (!bar || !label) return;

    const active = LAYERS.filter(l => layerStates[l.id]?.active);
    if (active.length === 0) {
        label.textContent = 'nothing yet';
        label.classList.remove('active');
        bar.classList.add('empty');
    } else {
        const egg = checkEasterEgg(active);
        label.textContent = egg || active.map(l => l.name.toLowerCase()).join(' + ');
        label.classList.add('active');
        bar.classList.remove('empty');
    }
}

// Sample cache
const sampleCache = {};

async function loadSample(ctx, url) {
    if (sampleCache[url]) return sampleCache[url];

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    sampleCache[url] = audioBuffer;
    return audioBuffer;
}

// Create a sample-based layer (loads audio file, loops it)
function createSampleLayer(sampleUrl) {
    return async (ctx, dest) => {
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(dest);

        const buffer = await loadSample(ctx, sampleUrl);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        source.start();

        return { source, gain };
    };
}

// Utilities
function createNoise(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
}

// State
let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let layerStates = {};

// Init audio context only (no layers)
// UI Sounds — feel, don't hear
function uiTick() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

function uiClick() {
    if (!audioCtx) return;
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.02, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.3));
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
    const g = audioCtx.createGain(); g.gain.value = 0.04;
    src.connect(f); f.connect(g); g.connect(audioCtx.destination); src.start();
}

function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
        console.warn('Web Audio API not supported');
        return;
    }

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 10;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(audioCtx.destination);

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(compressor);

    // Don't create any layers yet — lazy init when slider moves
    LAYERS.forEach(layer => {
        layerStates[layer.id] = {
            source: null,
            gain: null,
            extras: null,
            volume: 0,
            active: false,
            initialized: false,
        };
    });
}

// Master volume tracking for sample layers
let masterVolume = 0.7;

// Lazy-init a single layer's audio nodes (dual engine: synthesis or sample)
function initLayer(layerId) {
    const state = layerStates[layerId];
    if (!state || state.initialized || state.loading) return;
    const layerDef = LAYERS.find(l => l.id === layerId);
    if (!layerDef) return;

    state.loading = true;
    const card = document.getElementById(`layer-${layerId}`);
    if (card) card.classList.add('loading');

    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    if (layerDef.type === 'sample' && layerDef.src) {
        // HTML5 Audio — better iOS support, real recordings
        const audio = new Audio(layerDef.src);
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';
        audio.addEventListener('canplaythrough', () => {
            state.loading = false;
            if (card) card.classList.remove('loading');
        }, { once: true });
        audio.addEventListener('error', () => {
            console.warn(`Failed to load sample: ${layerDef.src}, falling back to synthesis`);
            state.loading = false;
            if (card) card.classList.remove('loading');
            // Fallback to synthesis if sample fails to load
            if (layerDef.create) {
                initSynthesisLayer(layerId, layerDef, state, card);
            }
        }, { once: true });
        audio.play().catch(() => {});
        state.audio = audio;
        state.type = 'sample';
        state.initialized = true;
        if (state.volume > 0) {
            audio.volume = state.volume * masterVolume;
        }
    } else {
        // Web Audio API synthesis
        initSynthesisLayer(layerId, layerDef, state, card);
    }
}

function initSynthesisLayer(layerId, layerDef, state, card) {
    try {
        // Create AnalyserNode for real-time visualization
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.connect(masterGain);

        const result = layerDef.create(audioCtx, analyser);
        if (result && typeof result.then === 'function') {
            result.then(nodes => {
                state.source = nodes.source;
                state.gain = nodes.gain;
                state.extras = nodes.extras || null;
                state.analyser = analyser;
                state.type = 'synthesis';
                state.initialized = true;
                state.loading = false;
                if (card) card.classList.remove('loading');
                if (state.gain) {
                    state.gain.gain.setValueAtTime(0, audioCtx.currentTime);
                    if (state.volume > 0) {
                        state.gain.gain.linearRampToValueAtTime(state.volume * 0.15, audioCtx.currentTime + 0.2);
                    }
                }
            });
        } else {
            state.source = result.source;
            state.gain = result.gain;
            state.extras = result.extras || null;
            state.analyser = analyser;
            state.type = 'synthesis';
            state.initialized = true;
            state.loading = false;
            if (card) card.classList.remove('loading');
            if (state.gain) {
                state.gain.gain.setValueAtTime(0, audioCtx.currentTime);
                if (state.volume > 0) {
                    state.gain.gain.linearRampToValueAtTime(state.volume * 0.15, audioCtx.currentTime + 0.2);
                }
            }
        }
    } catch(e) {
        console.warn(`Failed to init layer ${layerId}:`, e);
        state.loading = false;
        if (card) card.classList.remove('loading');
    }
}

// Set layer volume (0-1)
function setLayerVolume(layerId, vol) {
    const state = layerStates[layerId];
    if (!state) return;

    // Resume audio context on any slider interaction
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Lazy init: create audio nodes on first use (sync, in gesture call stack)
    if (vol > 0 && !state.initialized && !state.loading) {
        initLayer(layerId);
    }

    state.volume = vol;
    state.active = vol > 0;

    // Destroy nodes when volume goes to zero (free resources)
    if (vol === 0 && state.initialized) {
        if (state.type === 'sample' && state.audio) {
            state.audio.pause();
            state.audio.src = '';
            state.audio = null;
        } else {
            if (state.gain) {
                state.gain.gain.cancelScheduledValues(audioCtx.currentTime);
                state.gain.gain.setValueAtTime(0, audioCtx.currentTime);
            }
            setTimeout(() => {
                if (state.volume === 0) {
                    try { if (state.source) state.source.stop(); } catch(e) {}
                    try { if (state.source) state.source.disconnect(); } catch(e) {}
                    if (state.extras) {
                        state.extras.forEach(n => { try { n.stop(); } catch(e) {} try { n.disconnect(); } catch(e) {} });
                    }
                    if (state.gain) state.gain.disconnect();
                    state.source = null;
                    state.gain = null;
                    state.extras = null;
                }
            }, 300);
        }
        state.initialized = false;
        state.type = null;
        return;
    }

    // Set volume based on layer type
    if (state.type === 'sample' && state.audio) {
        state.audio.volume = vol * masterVolume;
    } else if (state.gain) {
        state.gain.gain.cancelScheduledValues(audioCtx.currentTime);
        state.gain.gain.setValueAtTime(state.gain.gain.value, audioCtx.currentTime);
        state.gain.gain.linearRampToValueAtTime(vol * 0.15, audioCtx.currentTime + 0.2);
    }
}

// Master volume — controls both synthesis (via gain node) and samples (via multiplier)
function setMasterVolume(vol) {
    masterVolume = vol;
    // Synthesis layers via master gain node
    if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
    }
    // Sample layers — update each directly
    Object.entries(layerStates).forEach(([id, state]) => {
        if (state.type === 'sample' && state.audio && state.active) {
            state.audio.volume = state.volume * vol;
        }
    });
}

// Toggle play/pause
function togglePlayback() {
    if (!audioCtx) {
        initAudio();
    }
    uiTick();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isPlaying = !isPlaying;
    if (isPlaying) {
        // Resume with current levels
        Object.entries(layerStates).forEach(([id, state]) => {
            if (state.active && state.gain) {
                state.gain.gain.linearRampToValueAtTime(state.volume * 0.3, audioCtx.currentTime + 0.3);
            }
            if (state.active && state.type === 'sample' && state.audio) {
                state.audio.play().catch(() => {});
            }
        });
    } else {
        // Fade all to zero and pause samples
        Object.values(layerStates).forEach(state => {
            if (state.gain) {
                state.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
            }
            if (state.type === 'sample' && state.audio) {
                state.audio.pause();
            }
        });
    }

    document.getElementById('toggle-icon').textContent = isPlaying ? '⏸' : '▶';
}

// Top layers shown by default (from analytics data)
// Ordered: familiar → trending → cozy → simple → unique → experimental
const FEATURED_LAYERS = ['rain', 'brown-noise', 'fire', 'wind', 'snow', 'drone'];
let showAllLayers = localStorage.getItem('drift_show_all') === 'true';

// Waveform patterns per layer category
// Per-layer waveform patterns (unique visual signature for each sound)
const WAVE_PATTERNS = {
    // Weather
    'rain': (x, t) => Math.sin(x * 5 + t) * 0.5 + Math.sin(x * 13 + t * 2.1) * 0.3 + Math.sin(x * 21 + t * 0.7) * 0.2,
    'heavy-rain': (x, t) => Math.sin(x * 3 + t * 1.5) * 0.6 + Math.sin(x * 9 + t * 2.5) * 0.4,
    'thunder': (x, t) => Math.sin(x * 1.5 + t * 0.3) * 0.9 * Math.exp(-((x - Math.sin(t * 0.2) * 2) ** 2) * 0.3),
    'wind': (x, t) => Math.sin(x * 2 + t * 0.8) * 0.6 + Math.sin(x * 0.7 + t * 0.3) * 0.4,
    'snow': (x, t) => Math.sin(x * 1 + t * 0.2) * 0.3 + Math.sin(x * 3 + t * 0.5) * 0.15,
    // Spaces
    'fire': (x, t) => Math.sin(x * 8 + t * 3) * 0.3 + (Math.random() * 0.5) * Math.sin(x * 2 + t),
    'vinyl': (x, t) => Math.sin(x * 15 + t * 4) * 0.2 + (Math.random() > 0.95 ? 0.8 : 0),
    'cafe': (x, t) => Math.sin(x * 4 + t * 0.7) * 0.3 + Math.sin(x * 11 + t * 1.8) * 0.2 + Math.random() * 0.15,
    'train': (x, t) => Math.sin(x * 2 + t * 2.2) * 0.5 * (0.5 + 0.5 * Math.sin(t * 2.2)),
    // Nature
    'crickets': (x, t) => Math.sin(x * 20 + t * 5) * 0.3 * (Math.sin(t * 3 + x) > 0.3 ? 1 : 0.1),
    'waves': (x, t) => Math.sin(x * 1.5 + t * 0.4) * 0.7 + Math.sin(x * 0.5 + t * 0.15) * 0.3,
    'birds': (x, t) => Math.sin(x * 10 + t * 4) * 0.4 * (Math.sin(t * 2 + x * 3) > 0.5 ? 1 : 0.15),
    'leaves': (x, t) => Math.sin(x * 6 + t * 1.2) * 0.4 + Math.sin(x * 3 + t * 0.6) * 0.3,
    // Textures (these use AnalyserNode for real data, but fallback here)
    'drone': (x, t) => Math.sin(x * 2 + t * 0.3) * 0.8 + Math.sin(x * 0.5 + t * 0.1) * 0.2,
    'brown-noise': (x, t) => Math.sin(x * 3 + t * 0.5) * 0.5 + Math.sin(x * 7 + t * 0.9) * 0.3 + Math.sin(x * 1 + t * 0.2) * 0.2,
    'white-noise': (x, t) => (Math.random() - 0.5) * 0.8 + Math.sin(x * 20 + t) * 0.2,
    // Category fallbacks
    weather: (x, t) => Math.sin(x * 4 + t) * 0.7 + Math.sin(x * 7 + t * 1.3) * 0.3,
    spaces: (x, t) => Math.sin(x * 3 + t * 0.5) * 0.5 + Math.random() * 0.3,
    nature: (x, t) => Math.sin(x * 6 + t) * 0.4 + Math.sin(x * 12 + t * 2) * 0.4,
    textures: (x, t) => Math.sin(x * 2 + t * 0.3) * 0.8 + Math.sin(x * 0.5 + t * 0.1) * 0.2,
};

// Smoothing buffers per canvas
const smoothBuffers = new WeakMap();

function drawWaveform(canvas, category, volume, time, analyserData) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (volume <= 0) {
        smoothBuffers.delete(canvas);
        return;
    }

    const opacity = Math.min(volume * 1.5, 0.6);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(122, 138, 106, ${opacity})`;
    ctx.lineWidth = 1.5;

    if (analyserData && analyserData.length > 0) {
        // Get or create smoothing buffer
        let smooth = smoothBuffers.get(canvas);
        if (!smooth || smooth.length !== w) {
            smooth = new Float32Array(w);
            smoothBuffers.set(canvas, smooth);
        }

        // Real audio data with smoothing (lerp 30% new, 70% previous)
        const step = analyserData.length / w;
        for (let x = 0; x < w; x++) {
            const dataIndex = Math.floor(x * step);
            const raw = (analyserData[dataIndex] - 128) / 128;
            smooth[x] = smooth[x] * 0.7 + raw * 0.3;
            const y = h / 2 + smooth[x] * (h * 0.4) * volume;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
    } else {
        // Per-layer synthetic pattern (falls back to category if no layer-specific pattern)
        const pattern = WAVE_PATTERNS[canvas._layerId] || WAVE_PATTERNS[category] || WAVE_PATTERNS.textures;
        for (let x = 0; x < w; x++) {
            const nx = x / w * Math.PI * 4;
            const y = h / 2 + pattern(nx, time) * (h * 0.35) * volume;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

// Build a single layer card
function buildLayerCard(layer, parent) {
    const card = document.createElement('div');
    card.className = 'layer-card';
    card.id = `layer-${layer.id}`;
    card.innerHTML = `
        <div class="layer-icon" title="Click to mute/unmute">${layer.icon}</div>
        <div class="layer-name">${layer.name}</div>
        <div class="slider-container">
            <canvas class="wave-canvas" width="200" height="32"></canvas>
            <input type="range" class="layer-slider" id="slider-${layer.id}"
                min="0" max="100" value="0" />
        </div>
        <div class="layer-val" id="val-${layer.id}">0%</div>
    `;

    // Icon click = mute toggle — click the icon to silence, click again to restore
    let savedVolume = 0;
    const icon = card.querySelector('.layer-icon');
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const slider = card.querySelector('.layer-slider');
        const current = parseInt(slider.value);
        if (current > 0) {
            savedVolume = current;
            slider.value = 0;
            slider.dispatchEvent(new Event('input'));
            card.classList.add('muted');
        } else if (savedVolume > 0) {
            slider.value = savedVolume;
            slider.dispatchEvent(new Event('input'));
            card.classList.remove('muted');
        }
        uiTick();
    });

    // Animate waveform (real audio data when available, fallback to synthetic)
    const canvas = card.querySelector('.wave-canvas');
    canvas._layerId = layer.id;
    let animFrame;
    function animateWave() {
        const slider = card.querySelector('.layer-slider');
        const vol = slider ? parseInt(slider.value) / 100 : 0;
        // Try to get real audio data from AnalyserNode
        let analyserData = null;
        const state = layerStates[layer.id];
        if (state && state.analyser) {
            analyserData = new Uint8Array(state.analyser.frequencyBinCount);
            state.analyser.getByteTimeDomainData(analyserData);
        }
        drawWaveform(canvas, layer.category, vol, Date.now() / 1000, analyserData);
        if (vol > 0) animFrame = requestAnimationFrame(animateWave);
    }
    card._startWaveAnim = () => { cancelAnimationFrame(animFrame); animateWave(); };
    card._stopWaveAnim = () => { cancelAnimationFrame(animFrame); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, 200, 32); };
    const slider = card.querySelector('.layer-slider');
    let wasActive = false;
    slider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        if (!audioCtx) initAudio();
        if (!isPlaying) togglePlayback();
        setLayerVolume(layer.id, val);
        const isActive = val > 0;
        card.classList.toggle('active', isActive);
        card.querySelector('.layer-val').textContent = `${e.target.value}%`;
        if (isActive && !wasActive && window.nwlTrack) {
            window.nwlTrack('layer_activate', { layer: layer.id, name: layer.name, category: layer.category });
        }
        wasActive = isActive;
        updateSuggestions();
        updateNowPlaying();
        // Animate waveform
        if (isActive) card._startWaveAnim();
        else card._stopWaveAnim();
    });
    parent.appendChild(card);
}

// Build mixer UI — single set of cards, toggle visibility
function buildMixer() {
    const grid = document.getElementById('mixer-grid');
    grid.innerHTML = '';

    // Check if a mix is loading from URL (show all in that case)
    const hasMixParam = new URLSearchParams(window.location.search).has('mix');
    if (hasMixParam) showAllLayers = true;

    const categories = {};
    LAYERS.forEach(layer => {
        if (!categories[layer.category]) categories[layer.category] = [];
        categories[layer.category].push(layer);
    });

    Object.entries(categories).forEach(([cat, layers]) => {
        const section = document.createElement('div');
        section.className = 'mixer-category';

        const catHeader = document.createElement('h3');
        catHeader.className = 'cat-header';
        catHeader.textContent = cat.toUpperCase();
        if (!showAllLayers) catHeader.style.display = 'none';
        section.appendChild(catHeader);

        layers.forEach(layer => {
            buildLayerCard(layer, section);
            // In collapsed mode, hide non-featured layers
            if (!showAllLayers && !FEATURED_LAYERS.includes(layer.id)) {
                const card = section.lastElementChild;
                card.classList.add('hidden-layer');
            }
        });

        grid.appendChild(section);
    });

    // Toggle between featured and full view
    const toggle = document.createElement('button');
    toggle.className = 'show-all-btn';
    toggle.id = 'show-all-btn';
    if (showAllLayers) toggle.style.display = 'none';
    toggle.textContent = 'show all 16 layers';
    toggle.addEventListener('click', () => {
        showAllLayers = !showAllLayers;
        localStorage.setItem('drift_show_all', showAllLayers);
        if (showAllLayers) {
            document.querySelectorAll('.hidden-layer').forEach(el => el.classList.remove('hidden-layer'));
            document.querySelectorAll('.cat-header').forEach(el => el.style.display = '');
            toggle.textContent = 'show featured';
        } else {
            LAYERS.forEach(l => {
                if (!FEATURED_LAYERS.includes(l.id)) {
                    const card = document.getElementById(`layer-${l.id}`);
                    if (card) card.classList.add('hidden-layer');
                }
            });
            document.querySelectorAll('.cat-header').forEach(el => el.style.display = 'none');
            toggle.textContent = 'show all 16 layers';
        }
    });
    grid.appendChild(toggle);
}

// Presets (localStorage)
function getPresets() {
    try {
        return JSON.parse(localStorage.getItem('drift_presets') || '[]');
    } catch { return []; }
}

function generateMixName() {
    const active = LAYERS.filter(l => {
        const slider = document.getElementById(`slider-${l.id}`);
        return slider && parseInt(slider.value) > 0;
    }).map(l => l.name.toLowerCase());

    if (active.length === 0) return 'empty mix';

    const h = new Date().getHours();
    let timeLabel;
    if (h >= 23 || h < 5) timeLabel = 'late night';
    else if (h >= 5 && h < 12) timeLabel = 'morning';
    else if (h >= 12 && h < 17) timeLabel = 'afternoon';
    else if (h >= 17 && h < 20) timeLabel = 'evening';
    else timeLabel = 'night';

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[new Date().getDay()];

    return active.join(' + ') + ' · ' + day + ' ' + timeLabel;
}

function savePreset() {
    const levels = {};
    LAYERS.forEach(layer => {
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider && parseInt(slider.value) > 0) {
            levels[layer.id] = parseInt(slider.value);
        }
    });
    if (Object.keys(levels).length === 0) return;

    const name = generateMixName();
    const presets = getPresets();
    presets.unshift({ name, levels, createdAt: Date.now() });
    if (presets.length > 20) presets.length = 20;
    localStorage.setItem('drift_presets', JSON.stringify(presets));
    renderPresets();

    // Visual feedback
    const btn = document.getElementById('save-preset');
    if (btn) {
        btn.textContent = 'Saved!';
        setTimeout(() => btn.textContent = 'Save Mix', 2000);
    }
}

function loadPreset(levels) {
    if (!audioCtx) initAudio();
    if (!isPlaying) togglePlayback();
    uiClick();
    // Track preset load
    if (window.nwlTrack) {
        window.nwlTrack('preset_load', { layers: Object.keys(levels), count: Object.keys(levels).length });
    }
    // Reset all
    LAYERS.forEach(layer => {
        const val = levels[layer.id] || 0;
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider) {
            slider.value = val;
            slider.dispatchEvent(new Event('input'));
        }
    });
}

function renderPresets() {
    const list = document.getElementById('presets-list');
    const presets = getPresets();
    list.innerHTML = '';
    if (!presets.length) {
        list.innerHTML = '<p class="empty-presets">no saved mixes yet</p>';
        return;
    }
    presets.forEach((preset, i) => {
        const div = document.createElement('div');
        div.className = 'preset-item';
        const layerCount = Object.keys(preset.levels).length;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'preset-name';
        nameSpan.textContent = preset.name;
        nameSpan.title = 'click to rename';
        nameSpan.style.cursor = 'text';

        // Click name to rename inline
        nameSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'text';
            input.value = preset.name;
            input.className = 'preset-rename-input';
            input.maxLength = 50;
            input.style.cssText = 'background:transparent;border:1px solid var(--border);color:var(--text);font-size:inherit;font-family:inherit;padding:2px 4px;border-radius:4px;width:120px;outline:none;';
            nameSpan.replaceWith(input);
            input.focus();
            input.select();
            const save = () => {
                const newName = input.value.trim() || preset.name;
                const presets = getPresets();
                presets[i].name = newName;
                localStorage.setItem('drift_presets', JSON.stringify(presets));
                renderPresets();
            };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') renderPresets(); });
            input.addEventListener('blur', save);
        });

        const metaSpan = document.createElement('span');
        metaSpan.className = 'preset-meta';
        metaSpan.textContent = `${layerCount} layer${layerCount !== 1 ? 's' : ''}`;

        div.appendChild(nameSpan);
        div.appendChild(metaSpan);
        div.addEventListener('click', () => loadPreset(preset.levels));
        list.appendChild(div);
    });
}

// Share via URL
function getMixUrl() {
    const levels = {};
    LAYERS.forEach(layer => {
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider && parseInt(slider.value) > 0) {
            levels[layer.id] = parseInt(slider.value);
        }
    });
    const encoded = btoa(JSON.stringify(levels));
    const url = new URL(window.location);
    url.searchParams.set('mix', encoded);
    return url.toString();
}

let pendingMixLevels = null;

function loadMixFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const mix = params.get('mix');
    if (!mix) return false;
    try {
        pendingMixLevels = JSON.parse(atob(mix));

        // Show mix preview on the start overlay
        const startText = document.querySelector('.start-text');
        if (startText && pendingMixLevels) {
            const layerNames = Object.keys(pendingMixLevels)
                .map(id => {
                    const l = LAYERS.find(l => l.id === id);
                    return l ? l.name.toLowerCase() : id;
                })
                .join(' + ');
            startText.textContent = 'tap to play: ' + layerNames;
        }
        return true;
    } catch {
        return false;
    }
}

function shareMix() {
    const url = getMixUrl();
    if (window.nwlTrack) {
        window.nwlTrack('mix_share', { url });
    }
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('share-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Share', 2000);
    }).catch(() => {
        prompt('Copy this link:', url);
    });
}

// Publish mix to discover feed
async function publishMix() {
    const levels = {};
    LAYERS.forEach(layer => {
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider && parseInt(slider.value) > 0) {
            levels[layer.id] = parseInt(slider.value);
        }
    });
    if (Object.keys(levels).length === 0) return;

    const name = generateMixName();
    const btn = document.getElementById('publish-btn');

    try {
        await fetch('https://lxecuywjwasxijxgnutn.supabase.co/rest/v1/published_mixes', {
            method: 'POST',
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4ZWN1eXdqd2FzeGlqeGdudXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDM3OTIsImV4cCI6MjA4OTcxOTc5Mn0.Wyq_doDaRZ7EfdpwM2W0_BNtaVI47yN-4cy4yTWl7jo',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4ZWN1eXdqd2FzeGlqeGdudXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDM3OTIsImV4cCI6MjA4OTcxOTc5Mn0.Wyq_doDaRZ7EfdpwM2W0_BNtaVI47yN-4cy4yTWl7jo',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
            },
            body: JSON.stringify({ name, levels }),
        });
        if (btn) { btn.textContent = 'Published!'; setTimeout(() => btn.textContent = 'Publish', 2000); }
        uiClick();
        if (window.nwlTrack) window.nwlTrack('mix_publish', { name, layers: Object.keys(levels) });
    } catch(e) {
        if (btn) { btn.textContent = 'Failed'; setTimeout(() => btn.textContent = 'Publish', 2000); }
    }
}

// Event listeners
// Reset all layers
function resetAll() {
    LAYERS.forEach(layer => {
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider) {
            slider.value = 0;
            slider.dispatchEvent(new Event('input'));
        }
    });
    if (isPlaying) togglePlayback();
    uiClick();
}

document.getElementById('master-toggle').addEventListener('click', togglePlayback);
document.getElementById('master-volume').addEventListener('input', (e) => {
    setMasterVolume(e.target.value / 100);
});
document.getElementById('save-preset').addEventListener('click', savePreset);
document.getElementById('share-btn').addEventListener('click', shareMix);
document.getElementById('publish-btn')?.addEventListener('click', publishMix);
document.getElementById('reset-btn')?.addEventListener('click', resetAll);

// Subtle share nudge after 30 seconds of active mixing
let mixStartTime = null;
let shareNudged = false;
setInterval(() => {
    const hasActive = Object.values(layerStates).some(s => s.active);
    if (hasActive && !mixStartTime) mixStartTime = Date.now();
    if (!hasActive) { mixStartTime = null; shareNudged = false; }

    if (mixStartTime && !shareNudged && Date.now() - mixStartTime > 30000) {
        const btn = document.getElementById('share-btn');
        if (btn) btn.classList.add('nudge');
        shareNudged = true;
    }
}, 5000);

// Default mixes — curated starting points
const DEFAULT_MIXES = [
    {
        name: "rainy cafe",
        levels: { rain: 60, cafe: 45, vinyl: 20 },
    },
    {
        name: "deep focus",
        levels: { 'brown-noise': 70, rain: 25 },
    },
    {
        name: "midnight train",
        levels: { train: 65, rain: 30, drone: 15 },
    },
    {
        name: "sunday morning",
        levels: { birds: 50, leaves: 30, wind: 20 },
    },
    {
        name: "winter cabin",
        levels: { fire: 70, snow: 40, wind: 25 },
    },
    {
        name: "ocean at night",
        levels: { waves: 75, crickets: 30, drone: 10 },
    },
];

function renderDefaultMixes() {
    const section = document.getElementById('default-mixes');
    if (!section) return;
    DEFAULT_MIXES.forEach(mix => {
        const div = document.createElement('div');
        div.className = 'preset-item';
        const layerCount = Object.keys(mix.levels).length;
        div.innerHTML = `
            <span class="preset-name">${mix.name}</span>
            <span class="preset-meta">${layerCount} layer${layerCount !== 1 ? 's' : ''}</span>
        `;
        div.addEventListener('click', () => loadPreset(mix.levels));
        section.appendChild(div);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
    if (e.key === ' ') {
        e.preventDefault();
        togglePlayback();
    }
    if (e.key === 'm' || e.key === 'M') {
        const slider = document.getElementById('master-volume');
        if (masterGain && masterGain.gain.value > 0) {
            masterGain._savedVol = masterGain.gain.value;
            setMasterVolume(0);
            slider.value = 0;
        } else if (masterGain) {
            setMasterVolume(masterGain._savedVol || 0.7);
            slider.value = (masterGain._savedVol || 0.7) * 100;
        }
    }
    // 1-6 for default presets
    const presetIndex = parseInt(e.key) - 1;
    if (presetIndex >= 0 && presetIndex < (typeof DEFAULT_MIXES !== 'undefined' ? DEFAULT_MIXES.length : 0)) {
        loadPreset(DEFAULT_MIXES[presetIndex].levels);
    }
});

// Start overlay — tap to init audio (required for iOS Safari)
const mobileOverlay = document.getElementById('mobile-start');
if (mobileOverlay) {
    mobileOverlay.addEventListener('touchend', unlockAudio);
    mobileOverlay.addEventListener('click', unlockAudio);
}

function unlockAudio() {
    initAudio();
    if (audioCtx) {
        audioCtx.resume();

        // Play silent buffer to unlock Safari audio
        const buf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);
        src.start();
    }
    if (mobileOverlay) mobileOverlay.style.display = 'none';

    // Auto-play pending mix from URL
    if (pendingMixLevels) {
        loadPreset(pendingMixLevels);
        pendingMixLevels = null;
    }
}

// Global error handler — don't let one bad layer crash the whole app
window.addEventListener('error', (e) => {
    console.warn('Drift caught an error:', e.message);
});
window.addEventListener('unhandledrejection', (e) => {
    console.warn('Drift caught a promise rejection:', e.reason);
    e.preventDefault();
});

// Init
try {
    buildMixer();
    renderPresets();
    renderDefaultMixes();
    const hasMix = loadMixFromUrl();
    if (hasMix) {
        document.querySelector('.tagline').textContent = 'someone shared a mix with you — click anywhere to listen';
    }
} catch(e) {
    console.warn('Drift init error:', e);
}
