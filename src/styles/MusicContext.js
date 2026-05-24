'use client'
import React, { createContext, useContext, useState, useRef } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const timeoutsRef = useRef([]);
    const activeSongRef = useRef(null);

    const songs = { song_1 };

    // Mapeo de notas musicales a frecuencias reales (Hz) para el sintetizador
    const noteFreqs = {
        'a2': 110.00, 'b2': 123.47, 'c2': 65.41, 'd2': 73.42, 'e2': 82.41,
        'a3': 220.00, 'b3': 246.94, 'c3': 130.81, 'd3': 146.83, 'e3': 164.81, 'f#3': 185.00, 'g3': 196.00, 'c#3': 138.59,
        'c4': 261.63, 'e4': 329.63, 'g4': 392.00, 'b4': 493.88
    };

    // Función para reproducir una nota individual con un oscilador nativo
    const playNote = (noteName, startTime, duration, type = 'sine', volume = 0.1) => {
        if (!audioCtxRef.current || !noteFreqs[noteName]) return;

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(noteFreqs[noteName], startTime);

        // Envolvente de volumen (para evitar clics extraños al iniciar/parar la nota)
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.02);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const playPattern = async (songKey) => {
    if (typeof window === 'undefined') return;

    // 🔥 LA GUARDA CONTROLADORA: 
    // Si la canción que pides YA ESTÁ sonando, salimos de la función inmediatamente.
    // Esto evita que se reinicie el bucle al avanzar de página.
    if (activeSongRef.current === songKey && isPlaying) {
        console.log(`🎵 ${songKey} ya está sonando de fondo. Continuamos sin reiniciar.`);
        return; 
    }

    // Inicializar el contexto de audio real ligado al clic del usuario si no existe
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
    }

    // Si es una canción nueva o todo estaba parado, limpiamos lo anterior
    stopMusic();

        const songData = songs[songKey]?.();
    if (!songData) return;

    // 🔥 Guardamos la canción actual como la activa
    activeSongRef.current = songKey;
    setIsPlaying(true);
    console.log(`🔊 Iniciando secuencia nueva para: ${songKey}`);

    const tempo = 120; // BPM
    const beatDuration = 60 / tempo; 
    const now = audioCtxRef.current.currentTime;

    let currentOffset = 0;

    const scheduleLoop = () => {
        // Comprobación de seguridad: si el usuario paró la música o cambió de tema, rompemos el bucle
        if (activeSongRef.current !== songKey) return;

        let localOffset = currentOffset;

        // Secuenciar la Melodía
        songData.melodia.forEach((nota) => {
            const time = now + localOffset;
            const duration = beatDuration * 0.8;
            playNote(nota, time, duration, 'triangle', 0.15);
            localOffset += beatDuration;
        });

        // Secuenciar el Bajo
        let bajoOffset = currentOffset;
        songData.bajos.forEach((bajo) => {
            const time = now + bajoOffset;
            const duration = beatDuration * 4;
            playNote(bajo, time, duration, 'sawtooth', 0.08);
            bajoOffset += (beatDuration * 4);
        });

        const totalLoopTime = localOffset - currentOffset;
        currentOffset += totalLoopTime;

        const timeoutId = setTimeout(() => {
            scheduleLoop();
        }, totalLoopTime * 1000 - 100);

        timeoutsRef.current.push(timeoutId);
    };

    scheduleLoop();
};

// 2. Acuérdate de limpiar también la referencia en tu función stopMusic():
const stopMusic = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    activeSongRef.current = null; // 🔥 Reseteamos la canción activa
    setIsPlaying(false);
};

    return (
        <MusicContext.Provider value={{ playPattern, stopMusic, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);