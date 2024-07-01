import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminisService {

  API_GEMINI = environment.API_KEY;

  createModel(){
    const googleGenAI = new GoogleGenerativeAI(this.API_GEMINI);
    const generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 64,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }
    return googleGenAI.getGenerativeModel({model : 'gemini-1.5-pro', ...generation_config});
  }

  constructor() { }
}
