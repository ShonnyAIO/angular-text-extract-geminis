import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class PdfReaderService {

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';
  }

  async readPdf(pdfUrl: any): Promise<any> {
    const pdf = await pdfjsLib.getDocument({ data: pdfUrl }).promise;
    const maxPages = pdf.numPages;

    let text = '';
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join('\n');
      text += pageText + '\n';
    }
    return text;
  }
}
