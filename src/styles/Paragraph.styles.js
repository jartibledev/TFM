import styled from "styled-components";
  
const characterTypo = 'monospace';

export const Character = styled.h3`
    margin-bottom: ${props => props.$marginbottom || "0.9em"}; 
    color: ${props => props.$color || "black"},
    font-size: ${props => props.$fontsize || "1.3rem"};
    font-family: ${characterTypo}; 
    text-transform: uppercase;    
`;

export const TextCharacter = styled.p`
    margin: ${props => props.$margin || "0"}; 
    color: ${props => props.$color || "black"},
    font-size: ${props => props.$fontsize || "1.2rem"};
    font-family: ${characterTypo};
    line-height: ${props => props.$lineheight || "1.6"};
    white-space: ${props => props.$whitespace || "pre-wrap"};
`;

export const TextNarrator = styled.p`
    font-style: ${props => props.$fontstyle || "normal"}; 
    font-variant: ${props => props.$fontvariant || "normal"}; 
    font-size: ${props => props.$fontsize || "1.5rem"};
    font-family: ${characterTypo};
    line-height: ${props => props.$lineheight || "1.6"};
    letter-spacing: ${props => props.$lettersparcing || "10px"};;
`;

.element {
  border: 3px solid rgba(255, 255, 255, 1);
  border-radius: 8px;
  background-color: rgba(41, 41, 41, 0.5);
  color: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.text {
  font: normal normal 25px/1.2 "proxima-nova";
  letter-spacing: 10px;
}

