'use client'
import React, { createContext, useContext, useState, useRef } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const timeoutsRef = useRef([]);

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

        // 1. Inicializar el contexto de audio real ligado al clic del usuario
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }

        stopMusic(); // Limpiar secuencias anteriores

        const songData = songs[songKey]?.();
        if (!songData) return;

        setIsPlaying(true);
        console.log(`🔊 Ejecutando secuenciador polifónico nativo para: ${songKey}`);

        const tempo = 120; // BPM
        const beatDuration = 60 / tempo; // Duración de 1 tiempo en segundos
        const now = audioCtxRef.current.currentTime;

        // --- MOTOR DE SECUENCIACIÓN EN TIEMPO REAL ---
        let currentOffset = 0;

        // Bucle para repetir la estructura musical (Looping)
        const scheduleLoop = (loopStartIndex) => {
            let localOffset = currentOffset;

            // Secuenciar la Melodía (Pista Principal)
            songData.melodia.forEach((nota) => {
                const time = now + localOffset;
                const duration = beatDuration * 0.8;
                
                // Programamos el disparo del oscilador en el reloj de la tarjeta de sonido
                playNote(nota, time, duration, 'triangle', 0.15);
                localOffset += beatDuration;
            });

            // Secuenciar el Bajo en paralelo (dispara en cada bloque)
            let bajoOffset = currentOffset;
            songData.bajos.forEach((bajo) => {
                const time = now + bajoOffset;
                const duration = beatDuration * 4; // Notas largas
                playNote(bajo, time, duration, 'sawtooth', 0.08);
                bajoOffset += (beatDuration * 4);
            });

            // Duración total de esta vuelta del bucle
            const totalLoopTime = localOffset - currentOffset;
            currentOffset += totalLoopTime;

            // Programamos la siguiente vuelta un poco antes de que termine la actual
            const timeoutId = setTimeout(() => {
                scheduleLoop();
            }, totalLoopTime * 1000 - 100);

            timeoutsRef.current.push(timeoutId);
        };

        scheduleLoop();
    };

    const stopMusic = () => {
        // Cancelar todos los temporizadores activos
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        setIsPlaying(false);
    };

    return (
        <MusicContext.Provider value={{ playPattern, stopMusic, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);