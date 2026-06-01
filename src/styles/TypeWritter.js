'use client'

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { TextCharacter } from "./Paragraph.styles";

const blink = keyframes`
  50% { opacity: 0; }
`;


const WaitingCursor = styled.span`
  display: inline-block;
  margin-left: 4px;
  animation: ${blink} 0.6s step-end infinite;
  font-weight: bold;
`;

export default function TypewriterText({ text, speed = 40, isHorror = false, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  

  const intervalRef = useRef(null);

  useEffect(() => {
 
    setDisplayedText('');
    setIsComplete(false);
    if (!text) return;

    
    
   
    if (intervalRef.current) clearInterval(intervalRef.current);
    let currentString = '';
    let index = 0;
    intervalRef.current = setInterval(() => {
      currentString += text.charAt(index);
      setDisplayedText(currentString);
      index++;

      if (index >= text.length) {
        clearInterval(intervalRef.current);
        setIsComplete(true);
        if (onComplete) onComplete(); 
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  const handleSkip = (e) => {
    e.stopPropagation();
    
    if (!isComplete) {
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(text);
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <TextCharacter 
      onClick={handleSkip} 
      $keystyle={isHorror ? 'horror' : 'default'} 
      style={{ cursor: isComplete ? 'default' : 'pointer' }}
    >
      {displayedText}
      {isComplete && <WaitingCursor>▼</WaitingCursor>} 
    </TextCharacter>
  );
}