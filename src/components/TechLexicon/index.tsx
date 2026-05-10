import { useState } from 'react';

const TERMS = [
  {
    id: 'rocof',
    term: 'RoCoF',
    full: 'Rate of Change of Frequency',
    formula: 'df/dt = ΔP / (2 · H · S_base)',
    definition: 'Velocidad de cambio de la frecuencia (Hz/s) ante un desequilibrio de potencia activa. Cuanto menor es la inercia H, mayor es el RoCoF y más rápido cae la frecuencia. El 28-A el RoCoF superó 1,5 Hz/s en la fase final de la cascada.',
    value: '-1,5 Hz/s',
    source: 'REE / ENTSO-E',
    category: 'frecuencia',
    color: '#ef4444',
  },
  {
    id: 'inertia',
    term: 'Constante H',
    full: 'Inertia Constant',
    formula: 'H = E_k / S_nominal (segundos)',
    definition: 'Relación entre la energía cinética almacenada en la masa rotatoria de un generador y su potencia nominal. Determina cuánto tiempo puede un generador sostener su potencia ante un desequilibrio. El sistema ibérico tenía H=2,3 s global, pero H=1,3 s en el sur.',
    value: '1,3–3,84 s',
    source: 'ICAI',
    category: 'frecuencia',
    color: '#06b6d4',
  },
  {
    id: 'taplag',
    term: 'Tap-Lag',
    full: 'Transformer Tap Delay',
    formula: 'V_220kV = V_400kV · r - ΔV_lag',
    definition: 'La inercia mecánica de los Cambiadores de Tomas en Carga (OLTC) impide que los transformadores ajusten su relación de transformación instantáneamente. Amplifica transitorios de tensión desde la red de 400 kV hacia la red de 220 kV. El SCADA de REE mostraba 418 kV (normal); en Granada 220 kV la tensión real era 244 kV (>110% Vn).',
    value: '418→244 kV',
    source: 'ICAI/AELEC',
    category: 'tension',
    color: '#f97316',
  },
  {
    id: 'gridfollowing',
    term: 'Grid-Following',
    full: 'Grid-Following Inverter (GFL)',
    formula: 'i(t) = I_max · sin(ω_pll · t + θ_pll)',
    definition: 'Inversor que sincroniza su exportación con la tensión y frecuencia externas a través de un algoritmo PLL (Phase-Locked Loop). Requiere una referencia de red estable. Al degradarse la red, el PLL pierde estabilidad y el inversor se desconecta — contribuyendo al colapso precisamente cuando el sistema más necesita soporte reactivo.',
    value: '82% del mix',
    source: 'ENTSO-E / FutuRed',
    category: 'inversor',
    color: '#eab308',
  },
  {
    id: 'gridforming',
    term: 'Grid-Forming',
    full: 'Grid-Forming Inverter (GFM)',
    formula: 'v_o(t) = V_ref · sin(ω_ref · t + θ_virtual)',
    definition: 'Inversor que se comporta como fuente de tensión ideal detrás de una impedancia interna. Establece autónomamente tensión y frecuencia de referencia sin PLL externo. Mantiene operación ante perturbaciones severas. Obligatorio en NC RfG 2.0 para módulos ≥1 MW. Clave para evitar futuros colapsos similares.',
    value: '0% el 28-A',
    source: 'ENTSO-E NC RfG 2.0',
    category: 'inversor',
    color: '#22c55e',
  },
  {
    id: 'qv',
    term: 'Curvas Q-V',
    full: 'Curvas de Estabilidad de Tensión',
    formula: 'Q = f(V) — margen hasta colapso',
    definition: 'Representación de la potencia reactiva (Q) que un nudo puede absorber o inyectar en función de su tensión (V). El margen Q-V en Carmona se contrajo un 57% (de 2.964 a 1.268 MW) por efecto del mallado. Por debajo de ese margen, cualquier perturbación desencadena colapso de tensión irreversible.',
    value: '-57% margen',
    source: 'ICAI',
    category: 'tension',
    color: '#a78bfa',
  },
  {
    id: 'ferranti',
    term: 'Efecto Ferranti',
    full: 'V_R = V_S / cos(β · l) > V_S',
    definition: 'Fenómeno por el cual la tensión en el extremo receptor de una línea en vacío (o con carga ligera) supera la tensión en el extremo emisor, debido a la capacitancia distribuida de la línea. El mallado de 11 líneas en vacío inyectó 1,05–2,4 GVAr capacitivos al sistema ibérico.',
    value: '1,05–2,4 GVAr',
    source: 'ICAI',
    category: 'tension',
    color: '#f97316',
  },
  {
    id: 'ufls',
    term: 'UFLS',
    full: 'Under-Frequency Load Shedding',
    formula: 'ΔP_deslastre = f_trigger_step',
    definition: 'Deslastre automático de cargas ante caída de frecuencia. 3 escalones: 49,5 Hz (2.000 MW bombeo), 49,3 Hz (588 MW bombeo), 49,0 Hz (1.402 MW industrial). Paradoja del 28-A: el UFLS, al eliminar cargas inductivas (motores), suprimió los últimos sumideros de potencia reactiva, agravando la sobretensión que ya destruía la red.',
    value: '~4.000 MW',
    source: 'REE',
    category: 'proteccion',
    color: '#ef4444',
  },
  {
    id: 'hvdc',
    term: 'HVDC INELFE-1',
    full: 'High Voltage Direct Current VSC',
    formula: 'P_ref = constant (PMODE1)',
    definition: 'Enlace subterráneo de corriente continua España-Francia (2.000 MW nominales). PMODE3 (emulación AC): responde a oscilaciones interárea. PMODE1 (potencia fija): mantiene 1.000 MW constantes sin responder a la frecuencia. Cambió a PMODE1 a las 12:11 CEST. Resultado: exportó 1.000 MW durante el colapso en lugar de ayudar al sistema.',
    value: '1.000 MW fijos',
    source: 'REE p.103',
    category: 'regulacion',
    color: '#0ea5e9',
  },
  {
    id: 'ibr',
    term: 'IBR',
    full: 'Inverter-Based Resources',
    formula: 'S_sc_contribution ≈ 1.2 · I_nominal',
    definition: 'Recursos de generación conectados mediante inversores electrónicos en lugar de generadores síncronos. Solar FV, eólica y almacenamiento. No aportan inercia síncrona intrínseca. Su PLL los hace dependientes de una tensión externa estable. Representaban el 82% del mix el 28-A.',
    value: '82% penetración',
    source: 'ENTSO-E / REE',
    category: 'inversor',
    color: '#22c55e',
  },
  {
    id: 'pll',
    term: 'PLL',
    full: 'Phase-Locked Loop',
    formula: 'θ_pll(t) = ∫(ω_grid + K_p·v_q + K_i·∫v_q dt) dt',
    definition: 'Algoritmo de control que sincroniza la fase de un inversor con la tensión de red. En redes débiles (baja potencia de cortocircuito), el PLL puede volverse inestable ante perturbaciones severas, causando la desconexión masiva del parque IBR en el peor momento posible — el mecanismo exacto del 28-A.',
    value: 'inestable en red débil',
    source: 'ENTSO-E / FutuRed',
    category: 'inversor',
    color: '#eab308',
  },
  {
    id: 'po74',
    term: 'P.O. 7.4',
    full: 'Procedimiento de Operación 7.4',
    formula: 'cos(φ) = constant_regulated',
    definition: 'Normativa española de control de tensión en la red de transporte. Obligaba a la generación RCR a operar con factor de potencia FIJO, impidiendo el control dinámico de potencia reactiva a los IBR. Lleva años en tramitación de reforma. El Gobierno reconoce que su entrada en vigor habría sido el cambio más relevante para evitar el colapso.',
    value: 'años de demora',
    source: 'Gobierno / ENTSO-E',
    category: 'regulacion',
    color: '#8b5cf6',
  },
  {
    id: 'nrfg',
    term: 'NC RfG 2.0',
    full: 'Network Code Requirements for Generators v2.0',
    formula: 'GFM_obligatory = true',
    definition: 'Propuesta de actualización de ENTSO-E post-28A. Exige Grid-Forming obligatorio para todos los módulos ≥1 MW. Los inversores deberán comportarse como fuentes de tensión ideales con inercia sintética y capacidad de Black Start. Representa el mayor cambio regulatorio en la historia de los códigos de red europeos.',
    value: '≥1 MW obligatorio',
    source: 'ENTSO-E 2025',
    category: 'regulacion',
    color: '#0ea5e9',
  },
  {
    id: 'ssc',
    term: 'Ssc Cortocircuito',
    full: 'Short-Circuit Power (Ssc)',
    formula: 'S_sc = V_nominal² / Z_thevenin',
    definition: 'Medida de la "fortaleza" eléctrica de un nudo de la red. Alta Ssc significa mayor capacidad para soportar perturbaciones sin colapsar la tensión. La sustitución de generadores síncronos por IBR reduce drásticamente Ssc en los nudos, haciendo la red "débil" y propensa a inestabilidad.',
    value: 'mínimos históricos',
    source: 'FutuRed / ENTSO-E',
    category: 'red',
    color: '#06b6d4',
  },
  {
    id: 'blackstart',
    term: 'Black Start',
    full: 'Black Start Capability',
    formula: 'P_start = self_contained',
    definition: 'Capacidad de un generador para arrancar sin necesidad de tensión externa de la red. Solo ciertas centrales hidráulicas y algunos ciclos combinados tienen esta capacidad. Los BESS-GFM añaden una nueva categoría: Black Start distribuido, energizando islas eléctricas locales de forma autónoma.',
    value: 'solo hidro + GFM',
    source: 'REE / FutuRed',
    category: 'proteccion',
    color: '#22c55e',
  },
  {
    id: 'ost',
    term: 'Protecciones OST',
    full: 'Out-of-Step Tripping (Pérdida de Sincronismo)',
    formula: 'Z_seen_trajectory ∩ Trip_Zone = true',
    definition: 'Relés automáticos que detectan divergencia de polos angular entre sistemas y ordenan la apertura de los interruptores de interconexión. Actuaron a las 12:33:21 CEST en Baixas-Vic, Argia-Arkale y Argia-Hernani, aislando la Península Ibérica del sistema europeo continental. ENTSO-E confirma que actuaron correcta y normativamente.',
    value: '12:33:21 CEST',
    source: 'ENTSO-E §4.3',
    category: 'proteccion',
    color: '#22c55e',
  },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'frecuencia', label: 'Frecuencia / Inercia' },
  { id: 'tension', label: 'Tensión / Q-V' },
  { id: 'inversor', label: 'Inversores / PLL' },
  { id: 'proteccion', label: 'Protecciones' },
  { id: 'regulacion', label: 'Regulación / PO 7.4' },
  { id: 'red', label: 'Infraestructura' },
];

export default function TechLexicon() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  // Filter terms logic
  const filteredTerms = TERMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.full.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'todos' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedTerm = TERMS.find((t) => t.id === selectedTermId);

  return (
    <div className="flex-grow flex flex-col justify-between text-[#e2e8f0] font-sans">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-mono text-[#06b6d4] text-lg uppercase tracking-widest font-black flex items-center gap-2">
          <span>📖</span> GLOSARIO TÉCNICO INTERACTIVO
        </h2>
        <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-wider mt-1">
          Conceptos y Formulación de Dinámica Rápida del Sistema Eléctrico Ibérico
        </p>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg shadow-lg mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-[#0a0e1a] border border-[#1e3a5f]/60 rounded-lg px-3.5 py-2">
          <span className="text-[#06b6d4]">🔍</span>
          <input
            type="text"
            placeholder="Buscar por término, acrónimo, descripción o fórmula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-mono text-white placeholder-[#475569] focus:outline-none flex-grow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#94a3b8] hover:text-white font-mono text-xs"
            >
              [CLEAR]
            </button>
          )}
        </div>

        {/* Category Pill Selection */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded font-mono text-[10px] uppercase border transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4] font-bold shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                  : 'bg-transparent border-[#1e3a5f]/40 text-[#94a3b8] hover:text-[#e2e8f0] hover:border-[#1e3a5f]/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TERMS GRID (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch flex-grow">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            onClick={() => setSelectedTermId(term.id)}
            className="bg-[#0f1729] border border-[#1e3a5f] hover:border-[#0ea5e9]/70 rounded-lg p-5 cursor-pointer shadow-md hover:shadow-lg relative overflow-hidden transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top color tag indicator */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] transition-all"
              style={{ backgroundColor: term.color }}
            ></div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <span
                  className="font-mono text-base font-black tracking-wider group-hover:scale-105 transition-transform"
                  style={{ color: term.color }}
                >
                  {term.term}
                </span>
                <span className="text-[9px] font-mono text-[#475569] uppercase border border-[#1e3a5f]/40 px-1.5 py-0.5 rounded">
                  {term.category.toUpperCase()}
                </span>
              </div>

              <div className="text-[10px] font-mono text-[#94a3b8] tracking-wide mb-3 truncate">
                {term.full}
              </div>

              <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3 mb-4 select-none">
                {term.definition}
              </p>
            </div>

            <div className="border-t border-[#1e3a5f]/40 pt-3 mt-3 flex justify-between items-center font-mono">
              <span className="text-[10px] text-[#475569]">VALOR REGISTRAL:</span>
              <span className="text-xs font-bold text-white bg-[#0a0e1a] border border-[#1e3a5f]/60 px-2 py-0.5 rounded">
                {term.value}
              </span>
            </div>
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-full bg-[#0f1729]/50 border border-[#1e3a5f]/40 rounded-lg p-10 text-center font-mono text-xs text-[#475569]">
            ⚠️ Ningún concepto coincide con los filtros especificados. Intente resetear la búsqueda.
          </div>
        )}
      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-[#0a0e1a]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1729] border border-[#0ea5e9] rounded-lg p-6 max-w-xl w-full relative shadow-[0_0_35px_rgba(6,182,212,0.15)] animate-fade-in">
            {/* Top dynamic color block */}
            <div
              className="absolute top-0 left-0 right-0 h-[3.5px]"
              style={{ backgroundColor: selectedTerm.color }}
            ></div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedTermId(null)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-white font-mono text-xs border border-[#1e3a5f]/60 px-2 py-1 bg-[#0a0e1a] rounded"
            >
              [CERRAR ESC]
            </button>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3 border-b border-[#1e3a5f]/50 pb-3">
                <span className="font-mono text-2xl font-black" style={{ color: selectedTerm.color }}>
                  {selectedTerm.term}
                </span>
                <span className="text-[10px] font-mono text-[#94a3b8] uppercase">
                  {selectedTerm.category}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#475569] font-mono uppercase block">Nombre Completo</span>
                <span className="text-sm text-white font-mono font-medium">{selectedTerm.full}</span>
              </div>

              {/* Formula Panel (renders only if exists) */}
              {selectedTerm.formula && (
                <div className="bg-[#0a0e1a] border border-[#1e3a5f] p-4 rounded text-center">
                  <span className="text-[9px] text-[#06b6d4] font-mono uppercase block text-left mb-1">// EXPRESIÓN MATEMÁTICA</span>
                  <span className="font-mono text-[#67e8f9] text-base font-bold tracking-wider">
                    {selectedTerm.formula}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-[#475569] font-mono uppercase block mb-1">Definición Analítica</span>
                <p className="text-xs text-[#e2e8f0] leading-relaxed font-mono bg-[#0a0e1a]/40 border border-[#1e3a5f]/30 p-3.5 rounded">
                  {selectedTerm.definition}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#1e3a5f]/50 pt-4 font-mono text-xs">
                <div>
                  <span className="text-[9px] text-[#475569] uppercase block">Valor del Suceso</span>
                  <span className="font-bold text-white mt-1 block">{selectedTerm.value}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#475569] uppercase block">Fuentes Citadas</span>
                  <span className="font-bold text-[#06b6d4] mt-1 block">{selectedTerm.source}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
