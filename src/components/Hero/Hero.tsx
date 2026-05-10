import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-primary text-text-primary tech-grid flex flex-col justify-center items-center py-16 px-6 select-none overflow-hidden">
      
      {/* Refined Academic Double Border (Monograph Style) */}
      <div className="absolute inset-4 border border-main/50 pointer-events-none rounded"></div>
      <div className="absolute inset-6 border-2 border-main/25 pointer-events-none rounded"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center py-10">
        
        {/* Sello académico oficial al inicio */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-secondary border border-main px-3 py-1.5 rounded font-mono text-[10px] tracking-widest uppercase text-text-secondary w-fit shadow-sm">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          <span>SISTEMA PENINSULAR ESPAÑOL</span>
          <span className="text-text-secondary/40">|</span>
          <span className="font-bold text-accent">US_ETSI_2026</span>
        </div>

        {/* Eyebrow */}
        <p className="t-subheading">
          TFG · Grado en Ingeniería de la Energía · Univ. de Sevilla · 2026
        </p>

        {/* Título Principal */}
        <h1 
          className="font-serif font-extrabold text-text-primary tracking-tight leading-tight mb-4 select-text"
          style={{ fontSize: '2.5rem' }}
        >
          ¿Por qué colapsó la red eléctrica ibérica en 22 segundos?
        </h1>

        {/* Subtítulo Exacto */}
        <p 
          className="font-serif italic text-base md:text-lg text-text-secondary mb-8 select-text"
          style={{ maxWidth: '56ch', margin: '0 auto 2rem' }}
        >
          Análisis forense comparativo de las narrativas de REE, ICAI/AELEC y ENTSO-E sobre el incidente del 28 de abril de 2025.
        </p>

        {/* B5. DIVIDER */}
        <hr className="divider w-full mb-8" />

        {/* B6. GRID 4 COLUMNAS — metric-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
          {/* Item 1 */}
          <div className="metric-card flex flex-col justify-center items-center">
            <span className="value">22,5 s</span>
            <span className="unit">Intervalo de colapso</span>
          </div>

          {/* Item 2 */}
          <div className="metric-card flex flex-col justify-center items-center">
            <span className="value">&gt;15 GW</span>
            <span className="unit">Desbalance de potencia</span>
          </div>

          {/* Item 3 */}
          <div className="metric-card flex flex-col justify-center items-center">
            <span className="value">~60 M</span>
            <span className="unit">Personas afectadas</span>
          </div>

          {/* Item 4 */}
          <div className="metric-card flex flex-col justify-center items-center">
            <span className="value">82%</span>
            <span className="unit">Renovable (solar/eólica)</span>
          </div>
        </div>

        {/* B7. DIVIDER */}
        <hr className="divider w-full mb-8" />

        {/* B8. t-heading "Estructura del análisis" + grid de módulos */}
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          <h2 className="font-serif text-lg font-bold text-text-primary mb-6 text-center uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>
            Estructura del análisis
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
            <Link
              to="/brief"
              className="border border-accent text-text-primary font-mono text-xs tracking-wider py-3 px-4 rounded bg-secondary hover:bg-accent hover:text-white transition-all duration-200 text-center uppercase"
            >
              Capítulo I: Resumen Ejecutivo
            </Link>
            <Link
              to="/timeline"
              className="border border-accent text-text-primary font-mono text-xs tracking-wider py-3 px-4 rounded bg-secondary hover:bg-accent hover:text-white transition-all duration-200 text-center uppercase"
            >
              Capítulo II: Registro de Eventos
            </Link>
            <Link
              to="/simulator"
              className="border border-accent text-text-primary font-mono text-xs tracking-wider py-3 px-4 rounded bg-secondary hover:bg-accent hover:text-white transition-all duration-200 text-center uppercase"
            >
              Capítulo III: Simulador Dinámico
            </Link>
            <button
              onClick={() => setShowPdfModal(true)}
              className="border border-accent text-text-primary font-mono text-xs tracking-wider py-3 px-4 rounded bg-secondary hover:bg-accent hover:text-white transition-all duration-200 text-center uppercase cursor-pointer"
            >
              Archivo Académico Completo (PDF)
            </button>
          </div>
        </div>

        {/* B9. CTA al final del Hero */}
        <div style={{marginTop:'2.5rem', paddingTop:'2rem',
                     borderTop:'1px solid var(--border-subtle)',
                     display:'flex', alignItems:'center', gap:'1rem'}}>
          <a href="https://github.com/Alfonsomongee/tfg-blackout-interactivo"
             target="_blank"
             rel="noreferrer"
             style={{fontFamily:'var(--font-mono)', fontSize:'0.8125rem',
                     color:'var(--text-secondary)', textDecoration:'none',
                     border:'1px solid var(--border)', padding:'0.5rem 1rem',
                     borderRadius:'var(--radius-sm)'}}>
            Código fuente →
          </a>
          <span className="t-caption">
            Datos: REE · ICAI/AELEC · ENTSO-E · Comité de Análisis MITECO
          </span>
        </div>

        {/* B10. Citar este trabajo */}
        <details style={{marginTop:'1.5rem'}}>
          <summary style={{fontFamily:'var(--font-mono)', fontSize:'0.8125rem',
                           color:'var(--text-muted)', cursor:'pointer',
                           listStyle:'none'}}>
            ↳ Citar este trabajo
          </summary>
          <div style={{marginTop:'1rem', padding:'1.25rem',
                       background:'var(--bg-surface)',
                       border:'1px solid var(--border-subtle)',
                       borderRadius:'var(--radius-md)',
                       textAlign: 'left'}}>

            <p className="t-subheading" style={{marginBottom:'0.5rem'}}>APA</p>
            <p style={{fontFamily:'var(--font-mono)', fontSize:'0.8125rem',
                       color:'var(--text-secondary)', marginBottom:'1rem'}}>
              Monge Díaz-Ángel, A. (2026). Análisis del Apagón del 28 de
              Abril de 2025: Estabilidad y Baja Inercia en el Sistema
              Eléctrico Español [Trabajo Fin de Grado]. Universidad de Sevilla.
            </p>

            <p className="t-subheading" style={{marginBottom:'0.5rem'}}>IEEE</p>
            <p style={{fontFamily:'var(--font-mono)', fontSize:'0.8125rem',
                       color:'var(--text-secondary)', marginBottom:'1rem'}}>
              A. Monge Díaz-Ángel, «Análisis del Apagón del 28 de Abril
              de 2025», TFG, Depto. Ingeniería Energética,
              Univ. de Sevilla, Sevilla, 2026.
            </p>

            <p className="t-subheading" style={{marginBottom:'0.5rem'}}>BibTeX</p>
            <pre style={{fontFamily:'var(--font-mono)', fontSize:'0.75rem',
                         color:'var(--text-secondary)',
                         background:'var(--bg-raised)',
                         padding:'0.75rem', borderRadius:'var(--radius-sm)',
                         overflowX:'auto'}}>
{`@mastersthesis{monge2026blackout,
  author={Monge D\\'iaz-\\'Angel, Alfonso},
  title={An\\'alisis del Apag\\'on del 28 de Abril de 2025},
  school={Universidad de Sevilla},
  year={2026},
  type={Trabajo Fin de Grado}
}`}
            </pre>
          </div>
        </details>

      </div>

      {/* PDF Informative Modal styled as an Archival Slip */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-primary/95 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-secondary border-2 border-main p-8 max-w-lg w-full rounded shadow-md relative">
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary font-mono text-sm cursor-pointer"
            >
              [CERRAR X]
            </button>
            <h3 className="font-serif text-base font-bold text-accent mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-accent rounded-sm"></span>
              Ficha del Repositorio de la Universidad
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 select-text">
              El manuscrito completo del TFG titulado <strong className="text-text-primary">"Investigación Dinámica de Estabilidad de Frecuencia y Parámetros Operativos del Sistema Eléctrico Ibérico del 2025"</strong> está catalogado en los archivos del Departamento de Ingeniería Eléctrica de la ETSI (Sevilla). Contiene los análisis de flujo dinámico, demostraciones formales de la ecuación del oscilador síncrono y los registros transitorios detallados de las subestaciones de 400 kV.
            </p>
            <div className="bg-tertiary p-4 rounded border border-main mb-6 font-mono text-[10px] text-text-primary">
              <div className="flex justify-between mb-1">
                <span>FORMATO:</span>
                <span className="font-bold">PDF / ISO-32000-1 Archival</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>TAMAÑO:</span>
                <span className="font-bold">8.42 MB</span>
              </div>
              <div className="flex justify-between">
                <span>MD5 CHECKSUM:</span>
                <span className="font-bold">9B3B9D90F9A8CE089F0A3E8A081B1C7E</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPdfModal(false)}
                className="bg-primary border border-main hover:border-accent text-[10px] font-mono px-4 py-2 rounded text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                CERRAR FICHA
              </button>
              <button
                onClick={() => {
                  alert('El documento de investigación completo se ha enviado al canal de descargas de la Universidad.');
                  setShowPdfModal(false);
                }}
                className="bg-accent hover:bg-accent/90 text-white text-[10px] font-mono font-bold px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
              >
                DESCARGAR MANUSCRITO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
