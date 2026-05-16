import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadCSV, downloadPDF, downloadSVG, generateFilename } from '../../utils/downloadUtils';

interface DownloadButtonProps {
  type: 'csv' | 'pdf' | 'svg';
  data?: Record<string, any>[];
  elementId?: string;
  svgElement?: SVGElement;
  filename?: string;
  className?: string;
  label?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  type,
  data,
  elementId,
  svgElement,
  filename,
  className = '',
  label,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const fn = filename || generateFilename(type.toUpperCase());

    try {
      switch (type) {
        case 'csv':
          if (!data) throw new Error('No data provided');
          downloadCSV(data, fn);
          break;
        case 'pdf':
          if (!elementId) throw new Error('No elementId provided');
          await downloadPDF(elementId, fn);
          break;
        case 'svg':
          if (!svgElement) throw new Error('No SVG element provided');
          downloadSVG(svgElement, fn);
          break;
      }
    } catch (error) {
      toast.error('Error al descargar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    csv: 'Descargar CSV',
    pdf: 'Descargar PDF',
    svg: 'Descargar SVG',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDownload}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs transition-all ${
        loading
          ? 'bg-warning/20 text-warning border border-warning opacity-75'
          : 'bg-transparent text-text-secondary hover:text-text-primary border border-border hover:border-text-primary'
      } disabled:cursor-not-allowed ${className}`}
    >
      <motion.div
        animate={loading ? { rotate: 360 } : { rotate: 0 }}
        transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Download size={14} />
      </motion.div>
      {label || labels[type]}
    </motion.button>
  );
};

export default DownloadButton;
