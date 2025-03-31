import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IIAResponse } from './types/IIAResponse';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  async askIA(question: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    const response = await axios.post<IIAResponse>(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-thinking-exp:free',
        messages: [{ role: 'user', content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // seu domínio real depois
        },
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string') {
      throw new Error('Resposta inválida da API');
    }

    return content;
  }
}
