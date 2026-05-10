import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  return (
    <div className="relative min-height-screen bg-[#0a0e1a] text-[#e2e8f0] tech-grid flex flex-col justify-center items-center py-20 px-6 select-none overflow-hidden">
      
      {/* Structural Corner Borders for Industrial Control Room Vibe */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#1e3a5f]"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#1e3a5f]"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#1e3a5f]"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#1e3a5f]"></div>

      {/* Grid overlay lines with opacity 0.3 */}
      <div className="absolute inset-0 bg-[#0a0e1a] bg-opacity-10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
        
        {/* Top telemetry signal */}
        <div className="flex items-center gap-3 mb-6 bg-[#0f1729]/80 border border-[#1e3a5f] px-4 py-1.5 rounded-md font-mono text-[11px] tracking-widest text-[#06b6d4]">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] alert-blink"></span>
          SEC-400KV // REGISTRO FORENSE DISPONIBLE
        </div>

        {/* Main Title */}
        <h1 className="font-mono text-[40px] md:text-[64px] font-extrabold text-[#e2e8f0] tracking-[0.05em] leading-tight mb-4 select-text">
          BLACKOUT 28·04·2025
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base md:text-[18px] text-[#94a3b8] tracking-normal max-w-2xl mb-12 select-text">
          Análisis forense interactivo del colapso del Sistema Eléctrico Ibérico
        </p>

        {/* Three Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-16">
          {/* Card 1 */}
          <div className="bg-[#0f1729] border border-[#1e3a5f] p-6 rounded-lg text-center flex flex-col justify-center items-center hover:border-[#0ea5e9]/50 transition-colors duration-300">
            <span className="font-mono text-[48px] font-bold text-[#06b6d4] leading-none mb-2">
              22,5 s
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">
              Duración colapso
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0f1729] border border-[#1e3a5f] p-6 rounded-lg text-center flex flex-col justify-center items-center hover:border-[#0ea5e9]/50 transition-colors duration-300">
            <span className="font-mono text-[48px] font-bold text-[#06b6d4] leading-none mb-2">
              ~15 GW
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">
              Generación perdida
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f1729] border border-[#1e3a5f] p-6 rounded-lg text-center flex flex-col justify-center items-center hover:border-[#0ea5e9]/50 transition-colors duration-300">
            <span className="font-mono text-[48px] font-bold text-[#06b6d4] leading-none mb-2">
              1,30 s
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-[#94a3b8] text-center">
              Inercia sur (zona raíz)
            </span>
          </div>
        </div>

        {/* Four Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <Link
            to="/timeline"
            className="border border-[#0ea5e9] text-[#e2e8f0] font-mono text-[13px] tracking-wider py-3.5 px-6 rounded bg-transparent hover:bg-[#0ea5e9] hover:text-[#0a0e1a] transition-all duration-200 text-center uppercase"
          >
            → Timeline del Colapso
          </Link>
          <Link
            to="/matrix"
            className="border border-[#0ea5e9] text-[#e2e8f0] font-mono text-[13px] tracking-wider py-3.5 px-6 rounded bg-transparent hover:bg-[#0ea5e9] hover:text-[#0a0e1a] transition-all duration-200 text-center uppercase"
          >
            → Matrix de Divergencia
          </Link>
          <Link
            to="/simulator"
            className="border border-[#0ea5e9] text-[#e2e8f0] font-mono text-[13px] tracking-wider py-3.5 px-6 rounded bg-transparent hover:bg-[#0ea5e9] hover:text-[#0a0e1a] transition-all duration-200 text-center uppercase"
          >
            → Simulador
          </Link>
          <button
            onClick={() => setShowPdfModal(true)}
            className="border border-[#0ea5e9] text-[#e2e8f0] font-mono text-[13px] tracking-wider py-3.5 px-6 rounded bg-transparent hover:bg-[#0ea5e9] hover:text-[#0a0e1a] transition-all duration-200 text-center uppercase cursor-pointer"
          >
            → Informe Completo PDF
          </button>
        </div>
      </div>

      {/* PDF Informative Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-[#0a0e1a]/95 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#0f1729] border-2 border-[#1e3a5f] p-8 max-w-lg w-full rounded-lg shadow-2xl relative">
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#e2e8f0] font-mono text-lg cursor-pointer"
            >
              [X]
            </button>
            <h3 className="font-mono text-lg font-bold text-[#06b6d4] mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#0ea5e9] rounded-sm"></span>
              DOCUMENTACIÓN TÉCNICA TFG
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed mb-6">
              El informe de investigación completo titulado <strong className="text-[#e2e8f0]">"Simulación del Colapso por Sobretensión del Sistema Eléctrico Ibérico el 28 de Abril de 2025"</strong> está disponible para su descarga académica en la biblioteca central de la Universidad. Contiene los anexos matemáticos de RoCoF zonal, cálculos de inercia y la parametrización de flujos de potencia.
            </p>
            <div className="bg-[#141e35] p-4 rounded border border-[#1e3a5f] mb-6 font-mono text-[11px] text-[#67e8f9]">
              <div className="flex justify-between mb-1">
                <span>FORMATO:</span>
                <span className="text-white">PDF / ISO-32000-1</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>TAMAÑO:</span>
                <span className="text-white">8.4 MB</span>
              </div>
              <div className="flex justify-between">
                <span>VERIFICACIÓN MD5:</span>
                <span className="text-white">9B3B9D90F9A8CE089F0A3E8A081B1C7E</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPdfModal(false)}
                className="bg-[#141e35] border border-[#1e3a5f] hover:border-[#0ea5e9] text-xs font-mono px-4 py-2 rounded text-[#94a3b8] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                CERRAR
              </button>
              <button
                onClick={() => {
                  alert('Generando archivo de simulación... El documento completo se ha enviado al canal de descargas.');
                  setShowPdfModal(false);
                }}
                className="bg-[#0ea5e9] hover:bg-[#06b6d4] text-[#0a0e1a] text-xs font-mono font-bold px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
              >
                DESCARGAR ARCHIVO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
