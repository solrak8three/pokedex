import fetch from 'node-fetch';
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const resp = await fetch(url);
      const data = resp.json() as Promise<T>;
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs.');
    }
  }
}