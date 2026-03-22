// DRIFT — Ambient Sound Mixer
// Built by Claude & Claudia, 2026
// Audio engine with layered Web Audio API synthesis

// Sound layer definitions
const LAYERS = [
    {
        id: 'rain',
        name: 'Rain',
        icon: '🌧',
        category: 'weather',
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
        icon: '⛆',
        category: 'weather',
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
        icon: '⛈',
        category: 'weather',
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
        icon: '💨',
        category: 'weather',
        create: (ctx, dest) => {
            const noise = createNoise(ctx);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 300;
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
        id: 'fire',
        name: 'Fireplace',
        icon: '🔥',
        category: 'spaces',
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
        icon: '💿',
        category: 'spaces',
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
        icon: '☕',
        category: 'spaces',
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
        icon: '🦗',
        category: 'nature',
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
        icon: '🏖',
        category: 'nature',
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
        icon: '🎵',
        category: 'textures',
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
        icon: '🟤',
        category: 'textures',
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
        icon: '⬜',
        category: 'textures',
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
        icon: '🚂',
        category: 'spaces',
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
        icon: '🐦',
        category: 'nature',
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
        icon: '🍃',
        category: 'nature',
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
        icon: '❄',
        category: 'weather',
        create: (ctx, dest) => {
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
            return { source: noise, gain };
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
function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

// Lazy-init a single layer's audio nodes (supports async for sample layers)
async function initLayer(layerId) {
    const state = layerStates[layerId];
    if (!state || state.initialized || state.loading) return;
    const layerDef = LAYERS.find(l => l.id === layerId);
    if (!layerDef) return;

    state.loading = true;

    // Show loading state on the card
    const card = document.getElementById(`layer-${layerId}`);
    if (card) card.classList.add('loading');

    try {
        const nodes = await layerDef.create(audioCtx, masterGain);
        state.source = nodes.source;
        state.gain = nodes.gain;
        state.extras = nodes.extras || null;
        state.initialized = true;
        if (state.gain) {
            state.gain.gain.setValueAtTime(0, audioCtx.currentTime);
            // Apply the pending volume
            if (state.volume > 0) {
                state.gain.gain.linearRampToValueAtTime(state.volume * 0.15, audioCtx.currentTime + 0.2);
            }
        }
    } catch(e) {
        console.warn(`Failed to init layer ${layerId}:`, e);
    }

    state.loading = false;
    if (card) card.classList.remove('loading');
}

// Set layer volume (0-1)
function setLayerVolume(layerId, vol) {
    const state = layerStates[layerId];
    if (!state) return;

    // Resume audio context on any interaction (iOS Safari requires user gesture)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Lazy init: create audio nodes on first use
    if (vol > 0 && !state.initialized) {
        initLayer(layerId);
    }

    state.volume = vol;
    state.active = vol > 0;

    // Destroy nodes when volume goes to zero (free resources)
    if (vol === 0 && state.initialized) {
        if (state.gain) {
            state.gain.gain.cancelScheduledValues(audioCtx.currentTime);
            state.gain.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        // Stop and disconnect after a brief fade
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
                state.initialized = false;
            }
        }, 300);
        return;
    }

    if (state.gain) {
        state.gain.gain.cancelScheduledValues(audioCtx.currentTime);
        state.gain.gain.setValueAtTime(state.gain.gain.value, audioCtx.currentTime);
        state.gain.gain.linearRampToValueAtTime(vol * 0.15, audioCtx.currentTime + 0.2);
    }
}

// Master volume
function setMasterVolume(vol) {
    if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
    }
}

// Toggle play/pause
function togglePlayback() {
    if (!audioCtx) {
        initAudio();
    }
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
        });
    } else {
        // Fade all to zero
        Object.values(layerStates).forEach(state => {
            if (state.gain) {
                state.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
            }
        });
    }

    document.getElementById('toggle-icon').textContent = isPlaying ? '⏸' : '▶';
}

// Build mixer UI
function buildMixer() {
    const grid = document.getElementById('mixer-grid');
    grid.innerHTML = '';

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
        section.appendChild(catHeader);

        layers.forEach(layer => {
            const card = document.createElement('div');
            card.className = 'layer-card';
            card.id = `layer-${layer.id}`;

            card.innerHTML = `
                <div class="layer-icon">${layer.icon}</div>
                <div class="layer-name">${layer.name}</div>
                <input type="range" class="layer-slider" id="slider-${layer.id}"
                    min="0" max="100" value="0" />
                <div class="layer-val" id="val-${layer.id}">0%</div>
            `;

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
                // Track layer activation
                if (isActive && !wasActive && window.nwlTrack) {
                    window.nwlTrack('layer_activate', { layer: layer.id, name: layer.name, category: layer.category });
                }
                wasActive = isActive;
                updateSuggestions();
            });

            section.appendChild(card);
        });

        grid.appendChild(section);
    });
}

// Presets (localStorage)
function getPresets() {
    try {
        return JSON.parse(localStorage.getItem('drift_presets') || '[]');
    } catch { return []; }
}

function savePreset() {
    const name = prompt('Name your mix:');
    if (!name) return;
    const levels = {};
    LAYERS.forEach(layer => {
        const slider = document.getElementById(`slider-${layer.id}`);
        if (slider && parseInt(slider.value) > 0) {
            levels[layer.id] = parseInt(slider.value);
        }
    });
    const presets = getPresets();
    presets.unshift({ name, levels, createdAt: Date.now() });
    if (presets.length > 20) presets.length = 20;
    localStorage.setItem('drift_presets', JSON.stringify(presets));
    renderPresets();
}

function loadPreset(levels) {
    if (!audioCtx) initAudio();
    if (!isPlaying) togglePlayback();
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
        div.innerHTML = `
            <span class="preset-name">${preset.name}</span>
            <span class="preset-meta">${layerCount} layer${layerCount !== 1 ? 's' : ''}</span>
        `;
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

function loadMixFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const mix = params.get('mix');
    if (!mix) return false;
    try {
        const levels = JSON.parse(atob(mix));
        // Wait for first click to init audio
        document.addEventListener('click', function loadOnce() {
            loadPreset(levels);
            document.removeEventListener('click', loadOnce);
        }, { once: true });
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

// Event listeners
document.getElementById('master-toggle').addEventListener('click', togglePlayback);
document.getElementById('master-volume').addEventListener('input', (e) => {
    setMasterVolume(e.target.value / 100);
});
document.getElementById('save-preset').addEventListener('click', savePreset);
document.getElementById('share-btn').addEventListener('click', shareMix);

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
        // Play a silent buffer to unlock iOS audio
        const silentBuffer = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
        const silentSource = audioCtx.createBufferSource();
        silentSource.buffer = silentBuffer;
        silentSource.connect(audioCtx.destination);
        silentSource.start();
        audioCtx.resume().then(() => {
            console.log('AudioContext unlocked:', audioCtx.state);
        });
    }
    if (mobileOverlay) mobileOverlay.style.display = 'none';
}

// Init
buildMixer();
renderPresets();
renderDefaultMixes();
const hasMix = loadMixFromUrl();
if (hasMix) {
    document.querySelector('.tagline').textContent = 'someone shared a mix with you — click anywhere to listen';
}
