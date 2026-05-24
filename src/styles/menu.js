import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import { useMusic } from './MusicContext';
import { Box, ButtonComponent } from '@/styles/Components.styles'
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
    <div style={{zIndex: '999'}}>
    <Box>
        <ButtonComponent onClick={() => setIsOpen(!isOpen)}>
            Settings
        </ButtonComponent>
        {isOpen && (
            <div>
                <div>
                    <div>
                        <ButtonComponent onClick={toggleMute} >
                        {isMuted ? 'Muted' : 'Sound' }
                        </ButtonComponent>
                    </div>
                 </div>
                 <LanguageSelector></LanguageSelector>
                 </div>

        )}
    </Box></div>
  )


}