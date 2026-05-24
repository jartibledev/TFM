'use client'
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const timeoutsRef = useRef([]);
    const activeSongRef = useRef(null);

    const songs = { song_1 };

    // 📥 Cargamos el script oficial de Strudel en el navegador (si no está ya cargado)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (document.getElementById('strudel-core-script')) return;

        const script = document.createElement('script');
        script.id = 'strudel-core-script';
        script.src = 'https://unpkg.com/@strudel/embed@latest/dist/strudel-embed.js';
        script.async = true;
        script.onload = () => {
            console.log("🎛️ Catálogo de sintetizadores de Strudel inyectado en el navegador.");
        };
        document.head.appendChild(script);
    }, []);

    const playPattern = async (songKey) => {
        if (typeof window === 'undefined') return;

        // Si la canción ya está sonando, no hacemos nada
        if (activeSongRef.current === songKey && isPlaying) return; 

        // Inicializamos el contexto de audio del navegador ligado al clic
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }

        stopMusic(); 

        const songData = songs[songKey]?.();
        if (!songData) return;

        activeSongRef.current = songKey;
        setIsPlaying(true);
        console.log(`🎶 Tocando con los sintetizadores reales de Strudel: ${songKey}`);

        const tempo = 120; // BPM
        const beatDuration = 60 / tempo;
        const now = audioCtxRef.current.currentTime;

        let currentOffset = 0;

        const scheduleLoop = () => {
            if (activeSongRef.current !== songKey) return;

            let localOffset = currentOffset;

            // 🎹 SECUENCIACIÓN USANDO EL MOTOR ACÚSTICO DE STRUDEL
            // Accedemos a las funciones de modelado de onda nativas que Strudel expone en el entorno global
            songData.melodia.forEach((nota) => {
                const time = now + localOffset;
                const duration = beatDuration * 0.8;

                // Si el script de Strudel terminó de cargar, usamos sus nodos de sonido balanceados
                if (window.strudel && typeof window.strudel.playTone === 'function') {
                    window.strudel.playTone({
                        note: nota,
                        time: time,
                        duration: duration,
                        sound: 'triangle', // Usando el timbre nativo de Strudel
                        cutoff: 900,       // Filtro de brillo de Strudel
                        resonance: 4
                    });
                } else {
                    // Salvavidas clásico si el script tarda un milisegundo en responder
                    fallbackPlay(nota, time, duration, 'triangle', 0.15);
                }
                localOffset += beatDuration;
            });

            // Capa de Bajos con el sonido denso ("sawtooth") original de Strudel
            let bajoOffset = currentOffset;
            songData.bajos.forEach((bajo) => {
                const time = now + bajoOffset;
                const duration = beatDuration * 4;

                if (window.strudel && typeof window.strudel.playTone === 'function') {
                    window.strudel.playTone({
                        note: bajo,
                        time: time,
                        duration: duration,
                        sound: 'sawtooth', // Tu sonido de sierra original
                        cutoff: 350,       // Filtro grave analógico
                        gain: 0.12
                    });
                } else {
                    fallbackPlay(bajo, time, duration, 'sawtooth', 0.08);
                }
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

    // Generador de ondas básico por si el script de la CDN no ha terminado de bajarse del todo
    const fallbackPlay = (noteName, startTime, duration, type, volume) => {
        const freqs = { 'a2': 110, 'e2': 82.41, 'd2': 73.42, 'a3': 220, 'e3': 164.81, 'c3': 130.81, 'g3': 196, 'f#3': 185, 'c#3': 138.59 };
        const freq = freqs[noteName] || 220;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type === 'sawtooth' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const stopMusic = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        activeSongRef.current = null;
        setIsPlaying(false);
    };

    return (
        <MusicContext.Provider value={{ playPattern, stopMusic, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);