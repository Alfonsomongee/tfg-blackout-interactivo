import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholderBlur?: string;
  onLoad?: () => void;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

export default function LazyImage({
  src,
  alt,
  placeholderBlur,
  onLoad,
  style,
  containerStyle,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // INTERSECTION OBSERVER PARA LAZY LOAD
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: '50px',  // Cargar 50px antes de entrar en el viewport
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-raised)',
        ...containerStyle,
      }}>

      {/* PLACEHOLDER BORROSO (opcional) */}
      {placeholderBlur && !isLoaded && (
        <img
          src={placeholderBlur}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* IMAGEN REAL CON FADE-IN */}
      {isVisible && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();  // Ejecutar callback si existe
          }}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 200ms ease-out',  // FADE-IN SUAVE
            ...style,
          }}
        />
      )}

      {/* FALLBACK SI ERROR DE CARGA */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-raised)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            textAlign: 'center',
            padding: '1rem',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
          <p style={{ margin: 0, fontSize: '1.25rem' }}>📷</p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>Imagen no disponible</p>
        </div>
      )}
    </div>
  );
}
