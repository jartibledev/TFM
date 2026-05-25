import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import { useMusic } from './MusicContext';
import { Box, ButtonComponent } from '@/styles/Components.styles'

const container = {
  display: 'flex',
  flexDirection: ' row',
  gap: '8px',
  padding: '10px',
  borderRadius : '4px',
  width: '100%'
}
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
    <div 
    style={{zIndex: '999', display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'auto'}}>
    
        <ButtonComponent $padding= "1em"  onClick={() => setIsOpen(!isOpen)}>
            Settings
        </ButtonComponent>
        {isOpen && (
          <Box $width= "100%" $height= "100%">
            <div style ={container}>
               
                        <ButtonComponent onClick={toggleMute} >
                        {isMuted ? 'Muted' : 'Sound' }
                        </ButtonComponent>
                    
                 <LanguageSelector></LanguageSelector>
                 </div></Box>

        )}
    
    </div>
  )


}