import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EVENTS = [
  {time: 0, label: '12:03:00', event: 'Inicio maniobra mallado', severity: 'info'},
  {time: 1080, label: '12:21:00', event: 'Mallado completo +1,2 GVAr', severity: 'warning'},
  {time: 1260, label: '12:24:00', event: 'Cambio HVDC PMODE3→PMODE1', severity: 'warning'},
  {time: 1440, label: '12:27:00', event: 'Tensión Carmona 388 kV', severity: 'alarm'},
  {time: 1740, label: '12:32:00', event: 'Oscilación 0,63 Hz', severity: 'alarm'},
  {time: 1757, label: '12:32:57', event: 'Disparo raíz Granada', severity: 'alarm'},
  {time: 1801, label: '12:33:21', event: 'Cero de tensión', severity: 'alarm'},
  {time: 2010, label: '12:36:30', event: 'Fin del colapso', severity: 'critical'},
];

export function TimelineNarrative() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(1);

  const generateChartData = () => {
    const data = [];
    for (let t = 0; t <= 2010; t += 30) {
      const freq = 50 - (t / 2010) * 2.5 - Math.sin(t / 150) * 0.3;
      const voltage = 100 - (t / 2010) * 35 - Math.sin(t / 100) * 5;
      data.push({
        time: Math.floor(t / 60),
        freq: Math.max(47, freq),
        voltage: Math.max(60, voltage),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (1 * playSpeed);
        if (next > 2010) {
          setIsPlaying(false);
          return 2010;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const currentEvent = EVENTS.find(e => Math.abs(e.time - currentTime) < 50);
  const chartMinutes = Math.floor(currentTime / 60);
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);

  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding:'2.5rem 3rem'}}>
      <p className="t-subheading" style={{marginBottom:'0.5rem'}}>Análisis temporal</p>
      <h2 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem', fontWeight:400,
                  color:'var(--text-primary)', marginBottom:'0.5rem'}}>
        Cronología interactiva del colapso
      </h2>
      <p className="t-body" style={{maxWidth:'600px', marginBottom:'2rem'}}>
        Reproductor: presiona Play para ver el colapso de 22 segundos acelerado a 30 segundos.
        Los gráficos se actualizan en tiempo real.
      </p>

      {/* PLAYER */}
      <div style={{background:'var(--bg-surface)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius-md)', padding:'1.5rem', marginBottom:'2rem'}}>
        
        <input
          type="range" min="0" max="2010" value={currentTime}
          onChange={(e) => {setCurrentTime(Number(e.target.value)); setIsPlaying(false);}}
          style={{width:'100%', height:'6px', borderRadius:'3px',
                 background:'var(--bg-tertiary)', cursor:'pointer', marginBottom:'0.5rem'}}
        />
        
        <p style={{fontSize:'0.8125rem', color:'var(--text-muted)',
                  fontFamily:'var(--font-mono)', margin:'0 0 1rem'}}>
          12:03:00 + {minutes}m {seconds}s
        </p>

        <div style={{display:'flex', gap:'0.75rem', alignItems:'center',
                    flexWrap:'wrap', marginBottom:'1rem'}}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{padding:'0.75rem 1.5rem', background:'var(--accent)',
                   color: 'white', border:'none', borderRadius:'var(--radius-md)',
                   cursor:'pointer', fontWeight:500, fontSize:'0.95rem'}}>
            {isPlaying ? '⏸ Pausar' : '▶ Play'}
          </button>

          <button
            onClick={() => setCurrentTime(0)}
            style={{padding:'0.5rem 1rem', background:'var(--bg-raised)',
                   border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)',
                   cursor:'pointer', fontSize:'0.875rem'}}>
            ⟲ Reiniciar
          </button>

          <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
            <label style={{fontSize:'0.8125rem', color:'var(--text-secondary)'}}>
              Velocidad:
            </label>
            {[1, 5, 10].map(speed => (
              <button key={speed}
                onClick={() => setPlaySpeed(speed)}
                style={{padding:'0.5rem 1rem', 
                       background: playSpeed === speed ? 'var(--info)' : 'var(--bg-raised)',
                       color: playSpeed === speed ? 'white' : 'var(--text-primary)',
                       border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)',
                       cursor:'pointer', fontSize:'0.875rem'}}>
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {currentEvent && (
          <div style={{padding:'0.75rem 1rem', background:'var(--bg-raised)',
                      border:'1px solid var(--warning)', borderRadius:'var(--radius-md)'}}>
            <p style={{margin:0, fontSize:'0.875rem', fontWeight:500,
                      color:'var(--text-primary)'}}>
              {currentEvent.label} — {currentEvent.event}
            </p>
          </div>
        )}
      </div>

      {/* CHARTS */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem',
                  marginBottom:'2rem'}}>
        
        <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)',
                    borderRadius:'var(--radius-md)', padding:'1.5rem'}}>
          <p style={{fontSize:'0.875rem', fontWeight:500, color:'var(--text-primary)',
                    margin:'0 0 1rem'}}>Frecuencia (Hz)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.filter(d => d.time <= chartMinutes + 1)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis domain={[47, 50.5]} stroke="var(--text-muted)" />
              <Tooltip contentStyle={{background:'var(--bg-primary)', border:'1px solid var(--border-subtle)'}} />
              <Line type="monotone" dataKey="freq" stroke="var(--warning)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{fontSize:'0.75rem', color:'var(--text-muted)', margin:'0.5rem 0 0',
                    fontFamily:'var(--font-mono)'}}>
            Límite UFLS: 49,5 Hz
          </p>
        </div>

        <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)',
                    borderRadius:'var(--radius-md)', padding:'1.5rem'}}>
          <p style={{fontSize:'0.875rem', fontWeight:500, color:'var(--text-primary)',
                    margin:'0 0 1rem'}}>Tensión Carmona (% Vn)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.filter(d => d.time <= chartMinutes + 1)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis domain={[60, 105]} stroke="var(--text-muted)" />
              <Tooltip contentStyle={{background:'var(--bg-primary)', border:'1px solid var(--border-subtle)'}} />
              <Line type="monotone" dataKey="voltage" stroke="var(--alarm)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{fontSize:'0.75rem', color:'var(--text-muted)', margin:'0.5rem 0 0',
                    fontFamily:'var(--font-mono)'}}>
            Margen: 90%-110% Vn
          </p>
        </div>
      </div>

      {/* EVENT LIST */}
      <div>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem', fontWeight:400,
                   color:'var(--text-primary)', marginBottom:'1rem'}}>
          Eventos clave
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0.75rem'}}>
          {EVENTS.map((e, i) => (
            <div key={i}
                 style={{padding:'0.75rem 1rem', background:'var(--bg-raised)',
                        borderLeft:`4px solid ${e.severity === 'critical' ? 'var(--alarm)' :
                                               e.severity === 'alarm' ? 'var(--alarm)' :
                                               e.severity === 'warning' ? 'var(--warning)' :
                                               'var(--info)'}`,
                        borderRadius:'var(--radius-md)',
                        opacity: Math.abs(e.time - currentTime) < 100 ? 1 : 0.6}}>
              <p style={{margin:'0 0 0.25rem', fontSize:'0.875rem', fontWeight:500,
                        color:'var(--text-primary)'}}>
                {e.label}
              </p>
              <p style={{margin:0, fontSize:'0.8125rem', color:'var(--text-secondary)'}}>
                {e.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineNarrative;
