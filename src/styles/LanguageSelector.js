'use client'
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const container = {
    display: 'flex', 
    gap: '10px', 
    padding: '10px', 
    width: '300px', 
    height: '150px',
    position: 'fixed',
    top: '20px', /* Distancia desde la parte inferior */
    right: '20px',  /* Distancia desde la parte derecha */
    zIndex: '9999'  /* Asegura que esté por encima de otros elementos */ 

}
const styleImage ={
    objectFit: 'cover',
    objectPosition: ' center',
      
}
export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname(); // Nos da la ruta actual (ej: /es/home_page)
  const [ isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if(!isClient) return null;

  const ChangeLanguage = (nuevoIdioma) => {
    if (!pathname) return;

    
    const segmentos = pathname.split('/');
    
    segmentos[1] = nuevoIdioma;

    const newPath = segmentos.join('/');

    router.push(newPath);
  };


  return createPortal (
    <div style={container}>
      <button 
        onClick={() => ChangeLanguage('es')} 
        className="tu-boton-idioma-style"
      > <img src="/icons/leanguages/Spanish_flag.svg"
                                          alt = "ES"
                                          
                                          style = {styleImage}

                                          ></img>
      </button>
      
      <button 
        onClick={() => ChangeLanguage('en')} 
        className="tu-boton-idioma-style"
      >
       <img src="/icons/leanguages/England_flag.svg"
                                          alt = "EN"
                                          
                                          style = {styleImage}

                                          ></img>
      </button>

      <button 
        onClick={() => ChangeLanguage('fr')} 
        className="tu-boton-idioma-style"
      >
        <img src="/icons/leanguages/French_flag.svg"
                                          alt = "FR"
                                          
                                          style = {styleImage}

                                          ></img>
      </button>
      <button 
        onClick={() => ChangeLanguage('de')} 
        className="tu-boton-idioma-style"
      >
        <img src="/icons/leanguages/German_flag.svg"
                                          alt = "DE"
                                          
                                          style = {styleImage}

                                          ></img>
      </button>
    </div>,
     document.body
  );
}