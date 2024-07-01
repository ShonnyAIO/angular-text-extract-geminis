import { Component, signal, inject, OnInit } from '@angular/core';
import { GenerativeModel } from '@google/generative-ai';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GeminisService } from './services/geminis.service';
import { PdfReaderService } from './services/pdf-reader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  model: GenerativeModel;
  resultPDF = signal('');
  resultGemini = signal('');

  constructor(private geminiService: GeminisService, private pdfReader: PdfReaderService) {
    this.model = this.geminiService.createModel();
  }

  async ngOnInit() {
    console.log('COMPONENTE CREADO');
  }

  getFile($event: any) {
    const file = $event.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const response = this.pdfReader.readPdf(reader.result);
      console.log('RESPONSE: ', response);
      this.resultPDF.set(await response);
      this.sendPrompt();
    }
  }

  async sendPrompt() {
    const prompt = `Dado el siguiente texto: ${this.resultPDF()} necesito que me des un resumen`;
    const streamingResponse = await this.model.generateContentStream(prompt);
    console.log('RESPUESTA GEMINIS: ', streamingResponse);
    for await (const item of streamingResponse.stream) {
      this.resultGemini.update(prev => prev + item.text());
    }
  }


}
