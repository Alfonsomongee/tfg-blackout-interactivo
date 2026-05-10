

const METHODOLOGY = {
  aiUsage: [
    {tool:'Claude (Anthropic)', purpose:'Estructuración de informes masivos, síntesis, extracción de narrativas', validation:'Contraste manual contra física de red y normativa oficial'},
    {tool:'Búsqueda sistemática bibliográfica', purpose:'Estado del arte: NREL, MIT CEEPR, FutuRed, papers ENTSO-E', validation:'Peer-reviewed journals + reports de autoridades técnicas'},
    {tool:'Análisis de fuentes primarias', purpose:'4 informes oficiales: Gobierno, REE, ICAI/AELEC, ENTSO-E', validation:'Documentos públicos de máxima autoridad'},
  ],
  validation: [
    {aspect:'Datos de inercia', sources:'REE (global 2,3s) + ICAI (zonal 1,3s-3,84s)', check:'Concordancia entre fuentes. Rango dentro de ENTSO-E.'},
    {aspect:'Márgenes Q-V', sources:'ICAI report: Carmona 2.964→1.268 MW (57%)', check:'Documentado en Compass Lexecon + modelos dinámicos ICAI'},
    {aspect:'Tensiones', sources:'REE SCADA 418kV vs ICAI real 244kV', check:'Tap-Lag validado en literatura IEEE Power Systems'},
    {aspect:'Timelines', sources:'REE timeline 12:03-12:33:30 CEST', check:'Sincronización con ENTSO-E PMU data'},
    {aspect:'UFLS stages', sources:'REE: 49,5 Hz (2.000 MW) / 49,3 Hz (588) / 49,0 Hz (1.402)', check:'P.O. 1.2 procedimiento de operación español'},
  ],
  sourceProvenance: [
    {name:'Gobierno español', docs:'Informe oficial 2025', access:'https://www.miteco.gob.es', type:'Primary'},
    {name:'Red Eléctrica (REE)', docs:'REE technical report', access:'https://www.ree.es', type:'Primary'},
    {name:'ICAI / AELEC', docs:'Informe Compass Lexecon', access:'Industry confidential (síntesis pública disponible)', type:'Primary'},
    {name:'ENTSO-E', docs:'Factual Report 28-A', access:'https://www.entsoe.eu', type:'Primary'},
    {name:'MIT CEEPR', docs:'Grid stability analysis', access:'https://ceepr.mit.edu', type:'Secondary peer-reviewed'},
    {name:'NREL', docs:'IBR stability dynamics', access:'https://www.nrel.gov', type:'Secondary peer-reviewed'},
  ],
  workflows: [
    {step:1, action:'Compilación de informes', method:'Lectura crítica de 4 documentos de 50-100 pp cada uno'},
    {step:2, action:'Identificación de discrepancias', method:'Matriz comparativa: 5 dimensiones × 4 agentes = 20 celdas de análisis'},
    {step:3, action:'Síntesis de consenso', method:'Identificación de 7 puntos donde las 4 narrativas coinciden'},
    {step:4, action:'Mapeo de divergencia', method:'Identificación de 5 ejes irreconciliables + implicaciones'}  ,
    {step:5, action:'Validación de física', method:'Contraste de cada afirmación técnica con ecuaciones de potencia'},
    {step:6, action:'Síntesis de lecciones', method:'3 fracturas de gobernanza emergentes del análisis forense'},
  ],
};

export default function MethodologyTransparency() {
  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 3rem'}}>
      <p className="t-subheading" style={{marginBottom:'0.5rem'}}>
        Rigor académico
      </p>
      <h2 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem',
                  fontWeight:400, color:'var(--text-primary)',
                  marginBottom:'0.5rem'}}>
        Metodología y validación
      </h2>
      <p className="t-body" style={{maxWidth:'600px', marginBottom:'2rem'}}>
        Este TFG combina análisis forense de informes institucionales con
        validación rigurosa contra la física del sistema y la normativa
        oficial. Aquí documentamos el proceso íntegro.
      </p>

      {/* AI USAGE */}
      <div style={{marginBottom:'2.5rem'}}>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem',
                   fontWeight:400, color:'var(--text-primary)',
                   borderBottom:'1px solid var(--border-subtle)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          Rol de la IA en la síntesis
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>
          {METHODOLOGY.aiUsage.map((u, i) => (
            <div key={i} style={{background:'var(--bg-raised)',
                               padding:'1rem', borderRadius:'var(--radius-md)'}}>
              <p style={{margin:'0 0 0.25rem', fontWeight:500,
                        fontSize:'0.95rem', color:'var(--text-primary)'}}>
                {u.tool}
              </p>
              <p style={{margin:'0 0 0.25rem', fontSize:'0.8125rem',
                        color:'var(--text-secondary)'}}>
                Purpose: {u.purpose}
              </p>
              <p style={{margin:0, fontSize:'0.75rem',
                        color:'var(--text-muted)', fontFamily:'var(--font-mono)'}}>
                Validación: {u.validation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* VALIDATION */}
      <div style={{marginBottom:'2.5rem'}}>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem',
                   fontWeight:400, color:'var(--text-primary)',
                   borderBottom:'1px solid var(--border-subtle)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          Validación de datos contra física y normativa
        </h3>
        <div className="table-academic">
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>Aspecto técnico</th>
                <th>Fuentes primarias</th>
                <th>Validación aplicada</th>
              </tr>
            </thead>
            <tbody>
              {METHODOLOGY.validation.map((v, i) => (
                <tr key={i}>
                  <td style={{fontWeight:500}}>{v.aspect}</td>
                  <td style={{fontFamily:'var(--font-mono)', fontSize:'0.8125rem'}}>
                    {v.sources}
                  </td>
                  <td style={{fontSize:'0.8125rem'}}>{v.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOURCES */}
      <div style={{marginBottom:'2.5rem'}}>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem',
                   fontWeight:400, color:'var(--text-primary)',
                   borderBottom:'1px solid var(--border-subtle)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          Procedencia de fuentes
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',
                    gap:'1rem'}}>
          {METHODOLOGY.sourceProvenance.map((s, i) => (
            <div key={i} style={{background:'var(--bg-surface)',
                               border:'1px solid var(--border-subtle)',
                               padding:'1rem', borderRadius:'var(--radius-md)'}}>
              <p style={{margin:'0 0 0.25rem', fontWeight:500,
                        fontSize:'0.95rem', color:'var(--text-primary)'}}>
                {s.name}
              </p>
              <p style={{margin:'0 0 0.5rem', fontSize:'0.8125rem',
                        color:'var(--text-secondary)'}}>
                {s.docs}
              </p>
              <p style={{margin:0, fontSize:'0.75rem',
                        color:'var(--text-muted)'}}>
                Tipo: <span style={{fontFamily:'var(--font-mono)'}}>{s.type}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WORKFLOW */}
      <div>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem',
                   fontWeight:400, color:'var(--text-primary)',
                   borderBottom:'1px solid var(--border-subtle)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          Flujo de trabajo del análisis forense
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0.75rem'}}>
          {METHODOLOGY.workflows.map((w, i) => (
            <div key={i} style={{display:'flex', gap:'1rem',
                               padding:'0.75rem 1rem',
                               background:'var(--bg-raised)',
                               borderRadius:'var(--radius-md)'}}>
              <div style={{width:'28px', height:'28px',
                         background:'var(--info)',
                         borderRadius:'50%',
                         display:'flex', alignItems:'center',
                         justifyContent:'center', color:'white',
                         fontWeight:500, fontSize:'0.875rem',
                         flexShrink:0}}>
                {w.step}
              </div>
              <div>
                <p style={{margin:'0 0 0.25rem', fontWeight:500,
                          fontSize:'0.95rem', color:'var(--text-primary)'}}>
                  {w.action}
                </p>
                <p style={{margin:0, fontSize:'0.8125rem',
                          color:'var(--text-secondary)'}}>
                  {w.method}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
