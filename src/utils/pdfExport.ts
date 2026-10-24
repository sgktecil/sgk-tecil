import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Triggers direct browser printing for the A4 document.
 * Uses native window.print() and also supports hidden iframe print context.
 */
export function printDirectDocument(elementId: string = 'a4-sheet'): void {
  const element = document.getElementById(elementId);

  // Attempt 1: Direct window.print() after ensuring focus
  try {
    window.focus();
    window.print();
    return;
  } catch (err) {
    console.warn('Standard window.print() error, attempting dedicated print frame:', err);
  }

  // Attempt 2: If standard print failed or was restricted, use clean dedicated iframe
  if (!element) return;

  try {
    const iframe = document.createElement('iframe');
    iframe.id = 'direct-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!doctype html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <title>Muvafakatname_Yazdir</title>
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #a4-sheet {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              page-break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Frame print failed:', e);
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 4000);
      }
    }, 250);
  } catch (e) {
    console.error('Print direct fallback error:', e);
  }
}

export async function exportToPdf(elementId: string, filename: string = 'Muvafakatname_Resmi_Belge.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Yazdırılacak A4 belgesi bulunamadı.');
  }

  const parent = element.parentElement;
  const originalParentTransform = parent ? parent.style.transform : '';
  if (parent) {
    parent.style.transform = 'none';
  }

  const originalBoxShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  } finally {
    element.style.boxShadow = originalBoxShadow;
    if (parent) {
      parent.style.transform = originalParentTransform;
    }
  }
}
