'use client'

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import MenuConfiguracion from '@/styles/menu';
import { ArticleComponent, ButtonComponent, ContainerIllustrations, Box } from '@/styles/Components.styles';
import { Character, TextCharacter } from '@/styles/Paragraph.styles';

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
    }else{
      setLastDecition("");
    }
    setInitialized(true);
  }, []);

  useEffect (() => {
    if (initialized) {
      localStorage.setItem('actual_page', actualPage)
      localStorage.setItem('last_decition', lastDecition);
    }
  }, [actualPage,lastDecition, initialized ]);

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
    finalText = pageDates.variants_text[lastDecition] || pageDates.text;
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
    <ArticleComponent >
      <ContainerIllustrations style={{ backgroundImage: `url(${pageDates.background})` }}>
      <MenuConfiguracion></MenuConfiguracion>
      <Box style={styleBox}
      onClick={(e) => e.stopPropagation()}>
      <Character>{pageDates.character}</Character>
      <TextCharacter>{finalText}</TextCharacter>
      {pageDates.options && pageDates.options.map((option, i) => (
          <ButtonComponent 
            key={i} 
            onClick={() => advancePage(option.next, option.decition)}
          >
            {option.text}
          </ButtonComponent>
        ))}


        {pageDates.next && !pageDates.options && (
          <ButtonComponent onClick={() => advancePage(pageDates.next)}>
            Next page
          </ButtonComponent>
        )}
      </Box>
        
      </ContainerIllustrations>
    </ArticleComponent>
  );
}