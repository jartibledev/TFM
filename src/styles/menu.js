import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import { useMusic } from './MusicContext';
import { Box, ButtonComponent } from '@/styles/Components.styles'

const container = {
  display: 'flex',
  flexDirection: ' column',
  gap: '8px',
  padding: '10px',
  borderRadius : '4px',
  width: '180px'
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
    style={{zIndex: '9999', display: 'inline-block',   position:'relative', width: '100%'}}>
    
        <ButtonComponent $padding= "1em"  onClick={() => setIsOpen(!isOpen)}>
            Settings
        </ButtonComponent>
        {isOpen && (
          <Box $width= "100%" $flexdirection = "row">
            <div style ={container}>
                      
                        <label>Activate/desactivate sound:</label>
                        <ButtonComponent $width = "50%" onClick={toggleMute} >
                        {isMuted ? 'Muted' : 'Sound' }
                        </ButtonComponent>
                  <label>Change lenguage:</label>  
                 <LanguageSelector></LanguageSelector>
                 </div>
                 
                 </Box>

        )}
    
    </div>
  )


}