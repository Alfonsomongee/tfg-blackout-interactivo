export default function FooterSimple() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '1.5rem 3rem',
      marginTop: '4rem',
      textAlign: 'center',
      background: 'var(--bg-raised)',
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    }}>
      <p style={{margin: 0}}>
        ETSI SEVILLA — AUTOR: ALFONSO MONGE DÍAZ-ÁNGEL — 2026
      </p>
    </footer>
  );
}
