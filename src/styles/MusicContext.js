'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

// Purga radical de hilos en la pestaña del navegador
const purgeAllWebIntervals = () => {
    if (typeof window === 'undefined') return;
    const highestIntervalId = setInterval(() => {}, 1000);
    for (let i = 0; i <= highestIntervalId; i++) {
        window.clearInterval(i);
    }
};

const getAudioSystem = () => {
    if (typeof window === 'undefined') return null;
    
    if (!window.__AUDIO_SYSTEM__) {
        window.__AUDIO_SYSTEM__ = {
            ctx: null,
            masterGain: null,
            activeSong: null,
            activeBgmUrl: null,
            bgmSource: null,
            hasActiveInterval: false 
        };
    }
    return window.__AUDIO_SYSTEM__;
};

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const songs = { song_1 };

    useEffect(() => {
        const sys = getAudioSystem();
        if (sys) {
            if (sys.ctx) {
                try { sys.ctx.close(); } catch(e) {}
                sys.ctx = null;
                sys.masterGain = null;
            }
            sys.hasActiveInterval = false; 
        }
        purgeAllWebIntervals();
    }, []);

    const toggleMute = () => {
        const sys = getAudioSystem();
        if (!sys) return;

        const newState = !isMuted;
        setIsMuted(newState);

        if (!sys.ctx || !sys.masterGain) return;

        if (newState) {
            sys.masterGain.gain.setValueAtTime(0, sys.ctx.currentTime);
        } else {
            sys.masterGain.gain.setValueAtTime(1, sys.ctx.currentTime);
        }
    };

    const initAudioContext = async () => {
        const sys = getAudioSystem();
        if (!sys) return null;

        if (!sys.ctx) {
            sys.ctx = new (window.AudioContext || window.webkitAudioContext)();
            sys.masterGain = sys.ctx.createGain();
            sys.masterGain.connect(sys.ctx.destination);
        }
        
        if (isMuted) {
            sys.masterGain.gain.setValueAtTime(0, sys.ctx.currentTime);
        } else {
            sys.masterGain.gain.setValueAtTime(1, sys.ctx.currentTime);
        }

        if (sys.ctx.state === 'suspended') {
            await sys.ctx.resume();
        }
        return sys.ctx;
    };

    const play = async (audioKeyOrUrl) => {
        const sys = getAudioSystem();
        if (!sys || !audioKeyOrUrl) return;

       
        if (audioKeyOrUrl.endsWith('.wav') && sys.bgmSource && sys.activeBgmUrl === audioKeyOrUrl) return;
        if (!audioKeyOrUrl.endsWith('.wav') && sys.hasActiveInterval && sys.activeSong === audioKeyOrUrl) return;

       
        purgeAllWebIntervals();
        sys.hasActiveInterval = false;

        try {
            await initAudioContext();

            if (sys.bgmSource) {
                try { sys.bgmSource.stop(); } catch(e){}
                sys.bgmSource = null;
            }

            if (audioKeyOrUrl.endsWith('.wav')) {
                sys.activeSong = null;
                await playWav(audioKeyOrUrl);
            } else {
                sys.activeBgmUrl = null;
                await playPattern(audioKeyOrUrl);
            }
        } catch (error) {
            console.error("Error en play:", error);
        }
    };

    const playWav = async (url) => {
        const sys = getAudioSystem();
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await sys.ctx.decodeAudioData(arrayBuffer);

            const source = sys.ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true; 
            source.connect(sys.masterGain);
            source.start(0);

            sys.bgmSource = source;
            sys.activeBgmUrl = url;
            setIsPlaying(true);
        } catch (error) {
            console.error("Error en playWav:", error);
        }
    };

    const playPattern = async (songKey) => {
        const sys = getAudioSystem();
        const songData = songs[songKey]?.();
        if (!songData) return;

        sys.activeSong = songKey;
        sys.hasActiveInterval = true; 
        setIsPlaying(true);

        const tempo = 120; 
        const beatDuration = 60 / tempo;
        const totalNotasMelodia = songData.melodia.length;
        const loopDurationSeconds = totalNotasMelodia * beatDuration;

        const runSequence = () => {
            if (sys.activeSong !== songKey) return;
            const now = sys.ctx.currentTime;

            songData.melodia.forEach((nota, index) => {
                const time = now + (index * beatDuration);
                const duration = beatDuration * 0.8;
                fallbackPlay(nota, time, duration, 'triangle', 0.40, songKey);
            });

            songData.bajos.forEach((bajo, index) => {
                const time = now + (index * beatDuration * 4);
                const duration = beatDuration * 4;
                fallbackPlay(bajo, time, duration, 'sawtooth', 0.25, songKey);
            });
        };

        runSequence();
        setInterval(runSequence, loopDurationSeconds * 1000);
    };

    const fallbackPlay = (noteName, startTime, duration, type, volume, songKey) => {
        const sys = getAudioSystem();
        if (!sys || !sys.ctx || !sys.masterGain || sys.activeSong !== songKey) return;

        const freqs = { 'a2': 110, 'e2': 82.41, 'd2': 73.42, 'a3': 220, 'e3': 164.81, 'c3': 130.81, 'g3': 196, 'f#3': 185, 'c#3': 138.59 };
        const freq = freqs[noteName] || 220;

        const osc = sys.ctx.createOscillator();
        const gain = sys.ctx.createGain();
        
        osc.type = type === 'sawtooth' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(sys.masterGain); 
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const stopAll = () => {
        const sys = getAudioSystem();
        purgeAllWebIntervals();
        
        if (sys && sys.bgmSource) {
            try { sys.bgmSource.stop(); } catch(e){}
            sys.bgmSource = null;
        }
        if (sys) {
            sys.activeSong = null;
            sys.activeBgmUrl = null;
            sys.hasActiveInterval = false;
        }
        setIsPlaying(false);
    };

    return (
        <MusicContext.Provider value={{ play, stopAll, isPlaying, isMuted, toggleMute }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);