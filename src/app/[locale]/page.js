import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function MotorJuego() {
  const [paginaActual, setPaginaActual] = useState('pregunta_examen');
  // Guardamos un historial de las elecciones del jugador
  const [ultimaDecision, setUltimaDecision] = useState('');

  const t = useTranslations('NovelaVisual.capitulo_1');
  const datosPagina = t.raw(paginaActual);

  const avanzarPagina = (siguienteClave, decisionTomada) => {
    if (decisionTomada) {
      setUltimaDecision(decisionTomada); // Guardamos "estudio" o "no_estudio"
    }
    setPaginaActual(siguienteClave);
  };

  // LÓGICA CLAVE: ¿El texto es fijo o depende de una decisión?
  let textoFinal = datosPagina.texto;
  if (datosPagina.textos_variantes) {
    textoFinal = datosPagina.textos_variantes[ultimaDecision];
  }

  return (
    <div className="contenedor" style={{ backgroundImage: `url(${datosPagina.fondo})` }}>
      {datosPagina.avatar && <img src={datosPagina.avatar} alt="Personaje" />}
      
      <div className="caja-dialogo">
        <h3>{datosPagina.personaje}</h3>
        <p>{textoFinal}</p> {/* Renderiza el texto dinámico */}

        {/* Si la página tiene opciones */}
        {datosPagina.opciones && datosPagina.opciones.map((opcion, i) => (
          <button 
            key={i} 
            onClick={() => avanzarPagina(opcion.siguiente, opcion.decision)}
          >
            {opcion.texto}
          </button>
        ))}

        {/* Si es una página de continuación lineal */}
        {datosPagina.siguiente && (
          <button onClick={() => avanzarPagina(datosPagina.siguiente)}>
            Continuar...
          </button>
        )}
      </div>
    </div>
  );
}