'use client'
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef(null);
    const timeoutsRef = useRef([]);
    const activeSongRef = useRef(null);

    // Canal dedicado para archivos de audio largos (.wav)
    const bgmSourceRef = useRef(null);
    const activeBgmUrlRef = useRef(null);

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

    // Inicializador seguro del AudioContext (reutiliza el mismo para síntesis y .wav)
    const initAudioContext = async () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    // 🔀 EL ENRUTADOR INTELIGENTE: Elige automáticamente según lo que venga en el JSON de mensajes
    const play = async (audioKeyOrUrl) => {
        if (typeof window === 'undefined' || !audioKeyOrUrl) return;
        
        await initAudioContext();

        // CASO A: Es un archivo .wav de música grabada completo
        if (audioKeyOrUrl.endsWith('.wav')) {
            if (activeBgmUrlRef.current === audioKeyOrUrl) return; // Ya está sonando esta misma canción
            
            stopMusic(); // Detiene síntesis si estuviera activa
            stopBGM();   // Detiene el .wav anterior
            
            console.log(`🎵 Cargando y reproduciendo archivo de audio WAV: ${audioKeyOrUrl}`);
            await playWav(audioKeyOrUrl);
        } 
        // CASO B: Es una clave de canción para sintetizar con código/Strudel
        else {
            if (activeSongRef.current === audioKeyOrUrl && isPlaying) return; // Ya está sonando
            
            stopBGM();   // Detiene el .wav si estuviera activo
            // playPattern ya ejecuta su propio stopMusic() dentro
            
            await playPattern(audioKeyOrUrl);
        }
    };

    // --- SUB-MOTOR A: Reproductor de archivos .wav largos ---
    const playWav = async (url) => {
        try {
            const ctx = audioCtxRef.current;
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true; // Para que la canción de fondo no se corte al terminar
            source.connect(ctx.destination);
            source.start(0);

            bgmSourceRef.current = source;
            activeBgmUrlRef.current = url;
            setIsPlaying(true);
        } catch (error) {
            console.error("Error cargando o decodificando el archivo .wav:", error);
        }
    };

    const stopBGM = () => {
        if (bgmSourceRef.current) {
            try {
                bgmSourceRef.current.stop();
            } catch (e) {
                // Previene errores si el nodo ya se detuvo
            }
            bgmSourceRef.current = null;
            activeBgmUrlRef.current = null;
        }
    };

    // --- SUB-MOTOR B: Tu secuenciador original de Strudel / Síntesis ---
    const playPattern = async (songKey) => {
        if (typeof window === 'undefined') return;

        if (activeSongRef.current === songKey && isPlaying) return; 

        await initAudioContext();
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
            songData.melodia.forEach((nota) => {
                const time = now + localOffset;
                const duration = beatDuration * 0.8;

                if (window.strudel && typeof window.strudel.playTone === 'function') {
                    window.strudel.playTone({
                        note: nota,
                        time: time,
                        duration: duration,
                        sound: 'triangle',
                        cutoff: 900,
                        resonance: 4
                    });
                } else {
                    fallbackPlay(nota, time, duration, 'triangle', 0.15);
                }
                localOffset += beatDuration;
            });

            // Capa de Bajos
            let bajoOffset = currentOffset;
            songData.bajos.forEach((bajo) => {
                const time = now + bajoOffset;
                const duration = beatDuration * 4;

                if (window.strudel && typeof window.strudel.playTone === 'function') {
                    window.strudel.playTone({
                        note: bajo,
                        time: time,
                        duration: duration,
                        sound: 'sawtooth',
                        cutoff: 350,
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

    // Generador de ondas básico de emergencia
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

    // Función de parada absoluta
    const stopAll = () => {
        stopMusic();
        stopBGM();
        setIsPlaying(false);
    };

    const stopMusic = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        activeSongRef.current = null;
        setIsPlaying(false);
    };

    return (
        <MusicContext.Provider value={{ play, stopAll, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);