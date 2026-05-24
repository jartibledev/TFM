import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import { useMusic } from './MusicContext';

export default function MenuConfiguracion() {
  const { isMuted, toggleMute } = useMusic();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
    const clickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div>
        <button onClick={() => setIsOpen(!isOpen)}>
            Settings
        </button>
        {isOpen && (
            <div>
                <div>
                    <div>
                        <span>iconos</span>
                        <button onClick={toggleMute} >
                        {isMuted ? 'Muted' : 'Sound' }
                        </button>
                    </div>
                 </div>
                 <LanguageSelector></LanguageSelector>
                 </div>

        )}
    </div>
  )


}