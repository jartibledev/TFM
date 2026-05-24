'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [strudelEngine, setStrudelEngine] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const songs = {
        song_1: song_1, 
    };

    useEffect(() => {
        // Inicializamos los módulos del lado del cliente de forma segura
        // Evitamos crasheos en el servidor (SSR) y fallos de análisis estático en Turbopack
        Promise.all([
            import('@strudel/core'),
            import('@strudel/webaudio')
        ]).then(([core, webaudio]) => {
            // Buscamos el inicializador o los controles nativos que expone el paquete de audio
            const controls = webaudio.webAudioControls || webaudio.controls || webaudio;
            if (controls) {
                setStrudelEngine(controls);
            }
        }).catch(err => console.error("Error cargando librerías de Strudel:", err));
    }, []);
    
    const playPattern = (songKey) => {
        if (typeof window === 'undefined' || !strudelEngine) return;

        try {
            // 1. Despertamos el AudioContext nativo
            if (typeof strudelEngine.initWebAudio === 'function') {
                strudelEngine.initWebAudio();
            } else if (typeof strudelEngine.initAudio === 'function') {
                strudelEngine.initAudio();
            }
            
            // 2. Limpiamos cualquier pista que estuviera sonando
            if (typeof strudelEngine.stop === 'function') {
                strudelEngine.stop();
            }

            if (songs[songKey]) {
                // 3. Evaluamos de manera segura tu estructura de array multipista
                strudelEngine.play(() => {
                    return songs[songKey](strudelEngine);
                });
                console.log(`🎶 Reproduciendo de forma segura: ${songKey}`);
            } else {
                strudelEngine.play(songKey);
            }

            setIsPlaying(true);
        } catch (error) {
            console.error("Error al reproducir en Strudel:", error);
        }
    };

    const stopMusic = () => {
        if (typeof window !== 'undefined' && strudelEngine && typeof strudelEngine.stop === 'function') {
            strudelEngine.stop();
            setIsPlaying(false);
        }
    };
     
    return (
        <MusicContext.Provider value={{ playPattern, stopMusic, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);