'use client'
import React, { createContext, useContext, useState } from 'react';
import { song_1 } from '@/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const songs = {
        song_1: song_1, 
    };
    
    const playPattern = (songKey) => {
        if (typeof window === 'undefined' || !window.strudel) {
            console.warn("Esperando a que Strudel cargue en el navegador...");
            return;
        }

        const sEngine = window.strudel;

        try {
          
            if (typeof sEngine.init === 'function') {
                sEngine.init();
            } else if (typeof sEngine.initAudio === 'function') {
                sEngine.initAudio();
            }
            
           
            if (window.AudioContext || window.webkitAudioContext) {
                const ctx = sEngine.context || sEngine.audioContext;
                if (ctx && ctx.state === 'suspended') {
                    ctx.resume();
                }
            }

            sEngine.stop();

            if (songs[songKey]) {
                
                const syncronizedTracks = songs[songKey](sEngine);
                if (Array.isArray(syncronizedTracks)) {
                    sEngine.play(sEngine.stack(...syncronizedTracks));
                } else {
                    sEngine.play(syncronizedTracks);
                }
                
                console.log(`🎶 Reproduciendo con éxito: ${songKey}`);
            } else {
                sEngine.play(songKey);
            }

            setIsPlaying(true);
        } catch (error) {
            console.error("Error al reproducir en Strudel:", error);
        }
    };
    const stopMusic = () => {
        if (typeof window !== 'undefined' && window.strudel) {
            window.strudel.stop();
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