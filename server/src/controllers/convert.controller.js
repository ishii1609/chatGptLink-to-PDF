import { validateShareUrl } from '../utils/validateShareUrl.js';
import { generatePdf } from '../services/pdf.service.js';

export async function convertToPdf(req, res, next) {
  try {
    const url = validateShareUrl(req.body?.url);
    const pdfBuffer = await generatePdf(url);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="chat.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    next(err); // errorHandler sambhal lega
  }
}