import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';

export default function MenuConfiguracion() {
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
                    <button>
                   
                    <div>
                        <span>iconos</span>
                        <span>Ambient music</span>
                    </div>
                    <span>On y of</span>
                 </button>
                 </div>
                 <LanguageSelector></LanguageSelector>
                 </div>

        )}
    </div>
  )


}