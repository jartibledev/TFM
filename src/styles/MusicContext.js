import React, { createContext, useContext, useEffect, useState  } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const [strudel, setStrudel] = useState(null);
    const [isPlaying, setIsPlaying ] = useState(false);

    useEffect(() => {
        import('@strudel/webaudio').then(({ webAudioControls }) => {
            setStrudel(webAudioControls);
        });
    }, []);

    const playPattern = ( codeString ) => {
        if (!strudel ) return;

        try {
            strudel.initWebAudio();
            strudel.play(codeString);
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