'use client';
import  { keyframes, styled, css } from "styled-components";

const ambientCatalogue = {
  "terror": css`
    background-color: rgba(139, 0, 0, 0.9);
    border: 3px double #ff0000;
    color: #000000;
  `,
  "misterio": css`
    background-color: rgba(18, 24, 38, 0.85);
    border: 2px dashed #4da6ff;
    color: #e6f2ff;
  `
};


const animationBottom = keyframes`
 from {
 
    opacity: 0;
    filter:blur(9px);
    backdrop-filter: blur(9px);
  }
  to {
    
    
    opacity: 1;
    transform: translateY(0);
  }
`;

export const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    /* IMPORTANTE: Este valor debe ser exactamente la mitad del ancho total */
    /* Si tienes 9 imágenes de 250px, la mitad son 2250px */
    transform: translateX(-2250px); 
  }
`;
export const toLeft = keyframes`
  from {
    transform: translateX(-2250px);
  }
  to {
    /* IMPORTANTE: Este valor debe ser exactamente la mitad del ancho total */
    /* Si tienes 9 imágenes de 250px, la mitad son 2250px */
    transform: translateX(0px); 
  }
`;

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`
};

const colorBorder = 'rgba(255, 255, 255, 1)';
const colorBackground = 'rgba(41, 41, 41, 0.5)';
const colorFont = 'rgba(255, 255, 255, 1)';
const colorBorderNegative = ' rgba(31, 31, 31, 0.63)';
const colorBackgroundNegative = 'rgba(255, 255, 255, 0.68)';
const colorFontNegative = 'rgba(0, 0, 0, 0.92)';

export const ArticleComponent = styled.article`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
    @media  ${device.mobileL} {
      padding: 0;
    }
    @media  ${device.mobileM} {
      padding: 0;
    }
    @media  ${device.mobileL} {
      padding: 0;
    }
    @media  ${device.tablet} {
      padding: 0;
    }
    @media  ${device.laptop} {
      padding: 5vh;
    }
    @media  ${device.laptopL} {
      padding: 5vh;
    }
    @media  ${device.desktop} {
      padding: 5vh;
    }
    @media  ${device.desktopL} {
      padding: 5vh;
    }
`;




export const ContainerIllustrations = styled.div`
position: ${props => props.$position || "relative"};
background-size:  ${props => props.$backgroundsize || "cover"};     
background-position:  ${props => props.$backgroundposition || "center"};     
background-repeat:  ${props => props.$backgroundrepeat || "no-repeat"};     
border-color: ${props => props.$bordercolor || "black"};  
overflow: ${props => props.$overflow || "hidden"};
@media ${device.mobileS} {
    width: 100vw;
    height: 100vh; 

    }
@media ${device.mobileS} {
    width: 100vw;
    height: 100vh; 

    }
@media ${device.mobileM} {
    width: 100vw;
    height: 100vh; 

    }
@media ${device.mobileL} {
    width: 100vw;
    height: 100vh; 

    }
@media ${device.laptop} {
    width: 40vw;
    height: 90vh; 

    }

@media ${device.laptopL} {
  width: 40vw;
  height: 90vh; 

    }
@media ${device.desktop} {
  width: 40vw;
  height: 90vh; 

    }
`;

export const Box = styled.div`
  /* =================================================== */
  /* 1. ESTILOS ESTRUCTURALES FIJOS (Siempre se ejecutan) */
  /* =================================================== */
  width: ${props => props.$width || "85%"};
  height: ${props => props.$height || "auto"};
  display: ${props => props.$display || "flex"};
  flex-direction: ${props => props.$flexdirection || "column"};
  border-width: ${props => props.$borderwidth || "3px"};
  border-radius: ${props => props.$borderradius || "8px"};
  backdrop-filter: ${props => props.$backdropfilter || "blur(9px)"};
  -webkit-backdrop-filter: ${props => props.$backdropfilter || "blur(9px)"};
  padding: ${props => props.$padding || "1em"};
  
  /* =================================================== */
  /* 2. LÓGICA DE COLOR DINÁMICA CON CONSOLE LOGS        */
  /* =================================================== */
  ${props => {
    // 🔍 CHIVATO 1: Ver qué string exacto está llegando desde page.js
    console.log("------- TESTEO DIÁLOGO BOX -------");
    console.log("1. String recibido en props.$keystyle:", props.$keystyle);
    console.log("2. Tipo de dato de la prop:", typeof props.$keystyle);

    // Intentamos buscarlo en tu objeto
    const estiloEncontrado = props.$keystyle ? ambientCatalogue[props.$keystyle] : null;
    
    // 🔍 CHIVATO 2: Ver si JavaScript ha emparejado el string con el catálogo
    console.log("3. ¿Existe esa clave en ambientCatalogue?:", estiloEncontrado ? "SÍ ✅" : "NO ❌");

    if (props.$keystyle && estiloEncontrado) {
      console.log("-> RESULTADO: Aplicando estilo del CATÁLOGO");
      return estiloEncontrado;
    } else {
      console.log("-> RESULTADO: Usando estilos por DEFAULT");
      return css`
        border-style: ${props.$borderstyle || "solid"};
        border-color: ${props.$bordercolor || colorBorder};
        background-color: ${props.$backgroundcolor || colorBackground};
        color: ${props.$color || colorFont};
      `;
    }
  }}
`;

export const ButtonComponent = styled.button`
  width: ${props => props.$width || "auto"} ;
  min-width: ${props => props.$minwidth || "50px"},
  height: ${props => props.$height || "auto"} ;
  min-height: ${props => props.$minwidth || "30px"};
  border-width : ${props => props.$borderwidth || "3px"};
  border-style : ${props => props.$borderstyle || "solid"};
  border-color: ${props => props.$bordercolor || colorBorder};
  border-radius: ${props => props.$borderradius || "5px"};
  background-color: ${props => props.$backgroundcolor || colorBackground};
  color: ${props => props.$color || colorFont};
  backdrop-filter: ${props => props.$backdropfilter || "blur(9px)"};
  -webkit-backdrop-filter: ${props => props.$backdropfilter || "blur(9px)"};
  margin-top: ${props => props.$margintop || "0.5em" };
  margin-bottom: ${props => props.$margintop || "0.5em" };
  padding: ${props => props.$padding || "5%"};
  white-space: 'nowrap';
  transition: 
    background-color 337ms ease-out, 
    color 300ms ease-out, 
    border 300ms ease-out, 
    border-radius 300ms ease-out;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

  &:hover {
    background-color: ${props => props.$backgroundcolorhover || colorBackgroundNegative};
    color: ${props => props.$colorhover || colorFontNegative};
    border-color:  ${props => props.$bordercolorhover || colorBorderNegative};
}
    &:active{
    background-color: ${props => props.$backgroundcoloractive || colorBackground};
    color: ${props => props.$coloractive || colorFont};
    border-color:  ${props => props.$bordercoloractive || colorBorder};
    transform:scale(0.50);
    }
  ${({ isclicked }) =>
    isclicked &&
    css`
      transform: scale(0.95);
      color: ${props => props.$colorhoverclick || colorFont};
    `} 
`;

export const SectionComponent = styled.section`
    width: ${props => props.$width || "100%"} ;
    height: ${props => props.$height || " 80vh"} ;
    display: ${props => props.$display || "flex"};
    flex-direction:${props => props.$flexdirection || "column"};
    align-items: ${props => props.$alignitems || "center"};
    padding-left: ${props => props.$paddingleft || "25%"};
    padding-right: ${props => props.$paddingright || "25%"};
    padding-bottom: ${props => props.$paddingbottom || "5%"};
`;

export const IconComponent = styled.div`
    width:  ${props => props.$width || "100%"};
    height: ${props => props.$height || "auto"};
    min-height: ${props => props.$minheight || "250px"};
    display: block;
    position: relative;
    overflow:  ${props => props.$overflow || "hidden"};
    border-radius:${props => props.$borderradius || "16px"};   
`;

export const AnimatedSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: "column";

  /* 1. ESTADO ATÓMICO INICIAL */
  opacity: 0;
  visibility: hidden;
  /* El will-change prepara al navegador para la animación y evita el parpadeo */
  will-change: opacity, transform; 
  
  transform: ${props => {
    if (props.$direction === 'none') return 'translate(0,0)';
    const offset = '50px';
    switch (props.$direction){
        case 'left': return `translateX(-${offset})`;
        case 'right': return `translateX(${offset})`;
        case 'down': return `translateY(-${offset})`;
        case 'up': return `translateY(${offset})`;
        default: return `translateY(${offset})`;
    }
  }};

  /* 2. TRANSICIÓN */
  /* Aumentamos a 0.8s para que el ojo humano no perciba saltos bruscos */
  transition: 
    opacity 0.8s ease-out, 
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
    visibility 0.8s;
  transition-delay: ${props => props.$delay};
  margin-right: ${props => props.$marginright || "5%"};
  margin-left: ${props => props.$marginleft || "5%"};
  
  /* 3. ESTADO VISIBLE */
  ${({ $isVisible }) => $isVisible && css`
    opacity: 1 !important;
    visibility: visible !important;
    transform: translate(0, 0) !important;
    filter: none !important;
    will-change: auto;
  `}
`;


export const FirstAnimation = styled.div`
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    

    opacity: 0;
    transform: translateY(-100px); 

    transition: opacity 2s ease-out, 
              transform 2s cubic-bezier(0.17, 0.55, 0.55, 1),
              filter 2s ease-out;
      ${({ $isVisible }) => $isVisible && css`
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
      `}


`;
export const ProgressBarContainerComponent = styled.div`
  width: ${props => props.$width || '100%'};
  height:${props => props.$height || '100%'};
  outline: ${props => props.$outline || '5px solid black'};
  margin: ${props => props.$margin || '5%'};
`;

export const ProgressBarComponent = styled.div`
    width: ${props => props.$progress || '25%'};
    height: 100%;
    background-color: black;
`;


export const RectangleComponent = styled.div`
    display: ${props => props.$display || 'grid'};
    grid-template-columns: ${props => props.$gridtemplatecolumns || 'auto auto auto'} ;
    
    border: ${props => props.border || '1.2rem solid black'} ;
    border-radius: ${props => props.$borderradius || '0px'};
    cursor: ${props => props.$cursor || ' pointer'};
    filter:  ${props => props.$filter || ' none'};
    backdrop-filter:  ${props => props.$backdropfilter || ' none'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(0);  
    &:hover {
        transform: translateY(-2px);
        filter:${props => props.$filterhover || ' blur(9px)'};
        backdrop-filter: ${props => props.$backdropfilterhover || 'blur(9px)'};
    }
    &:active{
    transform: translateY(0);
    }
`;


export const ButtonComponentReference = styled.button`
  display: ${props => props.$display || 'block'};
  border: ${props => props.$border || 'none'};
  padding: ${props => props.$padding || "0"};
  margin: ${props => props.$margin || "0"};
  cursor: ${props => props.$cursor || "pointer"};
  font: ${props => props.$font || "inherit"};
  width:${props => props.$width || "100%"};
  height:${props => props.$height || "100%"};
  background:${props => props.$background || "none"};
  opacity:${props => props.$opacity || "0.5"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);

   &:hover {
        opacity:${props => props.$opacity || "1"}; 
        transform: translateY(-2px);
    }
    &:active{
        animation: ${animationBottom} 0.3s ease;
    }
      img{
        opacity: inherit !important;
        }

     ${({ isclicked }) =>
    isclicked &&
    css`
      transform: scale(0.95); /* El botón se encoge un 5% al hacer clic */
    `}   
`;

