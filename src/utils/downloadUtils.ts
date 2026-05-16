import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function downloadCSV(data: Record<string, any>[], filename: string) {
  try {
    const toastId = toast.loading('⏳ Generando CSV...');

    if (data.length === 0) {
      toast.error('✗ No hay datos para exportar');
      toast.dismiss(toastId);
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.dismiss(toastId);
    toast.success(`✓ Descargado: ${filename}.csv`);
  } catch (error) {
    toast.error('Error al generar CSV');
  }
}

export async function downloadPDF(elementId: string, filename: string) {
  try {
    const toastId = toast.loading('⏳ Generando PDF...');
    const element = document.getElementById(elementId);

    if (!element) {
      toast.error('✗ Elemento no encontrado');
      toast.dismiss(toastId);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`${filename}.pdf`);

    toast.dismiss(toastId);
    toast.success(`✓ Descargado: ${filename}.pdf`);
  } catch (error) {
    toast.error('Error al generar PDF');
  }
}

export function downloadSVG(svgElement: SVGElement, filename: string) {
  try {
    const toastId = toast.loading('⏳ Generando SVG...');

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    toast.dismiss(toastId);
    toast.success(`✓ Descargado: ${filename}.svg`);
  } catch (error) {
    toast.error('Error al guardar gráfico');
  }
}

export function generateFilename(suffix?: string): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 10);
  const path = window.location.pathname.slice(1).replace(/\//g, '-') || 'export';
  return `${timestamp}_${path}${suffix ? `_${suffix}` : ''}`;
}
