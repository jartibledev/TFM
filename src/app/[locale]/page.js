'use client'

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GameEngine() {
  const [actualPage, setActualPage] = useState('page_1');
  const [initialized, setInitialized ] = useState(false);
  const [lastDecition, setLastDecition] = useState('');
  const t = useTranslations('VisualNovel.introduction');
 
  useEffect(() => {
    const saveGame = localStorage.getItem( 'actual_page');
    const saveDecition = localStorage.getItem('last_decition');
    if (saveGame){
      setActualPage(saveGame);
    }
    if (saveDecition) {
      setLastDecition(saveDecition)
    }
    setInitialized(true);
  }, []);

  useEffect (() => {
    if (initialized) {
      localStorage.setItem('actual_page', actualPage)
      localStorage.setItem('last_decition', lastDecition);
    }
  }, [actualPage, initialized]);

  if (!initialized) {
    return <div style={{color: 'white'}}>Loading Story...</div>
  }

  const pageDates = t.raw(actualPage);

  const advancePage = (nextKey, decitionTaken) => {
    if (decitionTaken) {
      setLastDecition(decitionTaken);
    }
    setActualPage(nextKey);
  };

  let finalText = pageDates.text;
  if (pageDates.variants_text) {
    finalText = pageDates.variants_text[lastDecision] || pageDates.text;
  }

  const positionDefault = {
    bottom: ' 40px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
  const styleBox = pageDates.position 
  ? { position: 'absolute', ...pageDates.position}
  : { position: 'absolute', ...positionDefault}

  return (
    <div className="contenedor-libre" style={{ backgroundImage: `url(${pageDates.background})` }}>
      
      <div className="caja-dialogo"
      style={styleBox}
      onClick={(e) => e.stopPropagation()}
      >

        <h3>{pageDates.character}</h3>
        <p>{finalText}</p> {/* Renderiza el text dinámico */}

        {/* Si la página tiene opciones */}
        {pageDates.options && pageDates.options.map((option, i) => (
          <button 
            key={i} 
            onClick={() => advancePage(option.next, option.decition)}
          >
            {option.text}
          </button>
        ))}

        {/* Si es una página de continuación lineal */}
        {pageDates.next && !pageDates.options && (
          <button onClick={() => advancePage(pageDates.next)}>
            Next...
          </button>
        )}
      </div>
    </div>
  );
}