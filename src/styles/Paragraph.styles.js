import styled from "styled-components";
  
const characterTypo = 'monospace';

export const Character = styled.h3`
    margin-bottom: ${props => props.$marginbottom || "0.9em"}; 
    color: ${props => props.$color || "black"};
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
    line-height: ${props => props.$lineheight || '1.6'};
    letter-spacing: ${props => props.$letterspacing || "10px"};
`;





