'use client'

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import MenuConfiguracion from '@/styles/menu';
import { ArticleComponent, ButtonComponent, ContainerIllustrations, Box } from '@/styles/Components.styles';
import { Character, TextCharacter } from '@/styles/Paragraph.styles';
import { useMusic } from '@/styles/MusicContext';

export default function GameEngine() {
  const [actualPage, setActualPage] = useState('page_1');
  const [subPage, setSubPage] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [lastDecition, setLastDecition] = useState('');
  const t = useTranslations('VisualNovel.introduction');
  
  const { play, stopAll } = useMusic();

  const pageDates = initialized && actualPage ? t.raw(actualPage) : null;
  const ambienteActual = pageDates && pageDates.style ? pageDates.style : "default";
  const currentBgmString = pageDates?.bgm || null;

  // 🛡️ CONTROL DE AUDIO ANTI-REINICIO POR IDIOMA
  useEffect(() => {
    if (initialized && currentBgmString) {
      // 🔍 Comprobación de seguridad directa con la ventana del navegador antes de llamar a play
      const sys = typeof window !== 'undefined' ? window.__AUDIO_SYSTEM__ : null;
      
      // Si el sistema ya está reproduciendo esta misma canción algorítmica, bloqueamos la llamada
      if (sys && sys.sequencerInterval && sys.activeSong === currentBgmString) {
        return; 
      }
      
      // Si es un .wav y ya está sonando, también la bloqueamos
      if (sys && sys.bgmSource && sys.activeBgmUrl === currentBgmString) {
        return;
      }

      // Solo si es una canción distinta o el motor estaba apagado, le damos permiso para sonar
      play(currentBgmString); 
    }
  }, [currentBgmString, initialized]); // Vigilancia limpia


  // Carga inicial del LocalStorage
  useEffect(() => {
    const saveGame = localStorage.getItem('actual_page');
    const saveDecition = localStorage.getItem('last_decition');
    const saveSubPage = localStorage.getItem('actual_sub_page');
    
    if (saveGame) {
      setActualPage(saveGame);
    }
    if (saveSubPage) {
      setSubPage(parseInt(saveSubPage, 10) || 0);
    }
    if (saveDecition) {
      setLastDecition(saveDecition);
    } else {
      setLastDecition("");
    }
    setInitialized(true);
  }, []);

  // Guardado automático en LocalStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('actual_page', actualPage);
      localStorage.setItem('last_decition', lastDecition);
      localStorage.setItem('actual_sub_page', subPage.toString());
    }
  }, [actualPage, lastDecition, subPage, initialized]);

  if (!initialized || !pageDates) {
    return <div style={{color: 'white'}}>Loading Story...</div>;
  }

  let finalText = pageDates.text;
  if (pageDates.variants_text) {
    finalText = pageDates.variants_text[lastDecition] || pageDates.text;
  }

  const textParagraphs = finalText.split('\n\n').filter(p => p.trim() != "");
  const currentTextChunk = textParagraphs[subPage] || textParagraphs[0];

  const handleNextClick = () => {
    if (subPage < textParagraphs.length - 1) {
      setSubPage(prev => prev + 1);
    } else {
      if (pageDates.next) {
        setActualPage(pageDates.next);
        setSubPage(0);
      }
    }
  };

  const handleOptionClick = (nextKey, decitionTaken) => {
    if (decitionTaken) setLastDecition(decitionTaken);
    setActualPage(nextKey);
    setSubPage(0);
  };

  const positionDefault = {
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)'
  };
  
  const styleBox = pageDates.position 
    ? { position: 'absolute', ...pageDates.position }
    : { position: 'absolute', ...positionDefault };

 
  const noText = textParagraphs[subPage]?.trim() === "";  
  const isEndOfText = subPage === textParagraphs.length - 1;

  return (
    <ArticleComponent>
      <ContainerIllustrations style={{ backgroundImage: `url(${pageDates.background})` }}>
        <MenuConfiguracion />

    
        <Box $keystyle={ambienteActual} style={styleBox}
         onClick={(e) => e.stopPropagation()}>
          <Character>{pageDates.character}</Character>
          <TextCharacter>{currentTextChunk}</TextCharacter>

          {isEndOfText && pageDates.next && !pageDates.options && (
            <ButtonComponent $width="5em"  onClick={handleNextClick}>
              Next
            </ButtonComponent>
          )}
          
          {!isEndOfText &&  (
            <ButtonComponent  $width="5em"  onClick={handleNextClick}>
              Next
            </ButtonComponent>
          )}

          {isEndOfText && pageDates.options && pageDates.options.map((option, i) => (
            <ButtonComponent 
              key={i} 
              onClick={() => handleOptionClick(option.next, option.decision || option.decition)}
            >
              {option.text}
            </ButtonComponent>
          ))}
        </Box>
      </ContainerIllustrations>
    </ArticleComponent>
  );
}