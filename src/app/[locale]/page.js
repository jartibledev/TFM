'use client'

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GameEngine() {
  const [actualPage, setActualPage] = useState('start');
  const [initialized, setInitialized ] = useState(false);

  const [lastDecition, setLastDecition] = useState('');
  const t = useTranslations('VisualNovel.chapter_0');
 

  useEffect(() => {
    const saveGame = localStorage.getItem( 'actual_page');
    if (saveGame){
      setActualPage(saveGame);
    }
    setInitialized(true);
  }, []);

  useEffect (() => {
    if (initialized) {
      localStorage.setItem('actual_page', actualPage)
    }
  }, [actualPage, initialized]);


  if (!initialized) {
    return <div style={{color: 'white'}}>Loading Story...</div>
  }

   const pageDates = t.raw(actualPage);

  const advancePage = (nextKey, decitionTaken) => {
    if (decitionTaken) {
      setLastDecition(decitionTaken); // Guardamos "estudio" o "no_estudio"
    }
    setActualPage(nextKey);
  };

  // LÓGICA CLAVE: ¿El text es fijo o depende de una decisión?
  let finalText = pageDates.text;
  if (pageDates.variants_text) {
    finalText = pageDates.variants_text[lastDecition];
  }

  return (
    <div className="contenedor" style={{ backgroundImage: `url(${pageDates.fondo})` }}>
      {pageDates.avatar && <img src={pageDates.avatar} alt="Personaje" />}
      
      <div className="caja-dialogo">
        <h3>{pageDates.personaje}</h3>
        <p>{finalText}</p> {/* Renderiza el text dinámico */}

        {/* Si la página tiene opciones */}
        {pageDates.opciones && pageDates.opciones.map((opcion, i) => (
          <button 
            key={i} 
            onClick={() => advancePage(opcion.siguiente, opcion.decision)}
          >
            {opcion.text}
          </button>
        ))}

        {/* Si es una página de continuación lineal */}
        {pageDates.siguiente && (
          <button onClick={() => advancePage(pageDates.siguiente)}>
            Continuar...
          </button>
        )}
      </div>
    </div>
  );
}