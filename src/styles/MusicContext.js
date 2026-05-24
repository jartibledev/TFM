import React, { createContext, useContext, useEffect, useState  } from 'react';
import { song1 } from '../../public/music/song_1';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [strudel, setStrudel] = useState(null);
    const [isPlaying, setIsPlaying ] = useState(false);
    const songs = {
        song1: song1, 
    };
    
    useEffect(() => {
        import('@strudel/webaudio').then(({ webAudioControls }) => {
            setStrudel(webAudioControls);
        });
    }, []);

    const playPattern = ( songKey ) => {
        if (!strudel ) return;

        try {
            strudel.initWebAudio();
            strudel.stop();
            if (songs[songKey]){
                strudel.paly(() => {
                    songs[songKey](strudel);
                });
            }else {
                strudel.play(songKey);
            }

            setIsPlaying(true);

        }catch (error) {
            console.error("Error loading Strudel:", error);
        }
    };

    const stopMusic = () => {
        if (strudel) {
            strudel.stop();
            setIsPlaying(false);
        }
    };
     
    return (
        <MusicContext.Provider value ={{ playPattern, stopMusic, isPlaying }}>
            {children}
        </MusicContext.Provider>
    );


}

export const useMusic = () => useContext(MusicContext);