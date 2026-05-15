import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Color shifts blue → orange → red as the reader advances through the page
  const color =
    progress < 50
      ? 'var(--accent-blue)'
      : progress < 80
        ? 'var(--warning)'
        : 'var(--alarm)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: color,
        boxShadow: `0 0 10px ${color}`,
        zIndex: 1000,
        transition: 'width 80ms ease-out, background 300ms ease, box-shadow 300ms ease',
      }}
      aria-hidden="true"
    />
  );
}
