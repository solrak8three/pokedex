import { BadRequestException, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { PokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {

  async executedSeed() {
    try {
      const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      if (!resp.ok) {
        throw new BadRequestException('Error al realizar la petición.')
      }
      const data = resp.json() as Promise<PokeResponse>;
      (await data).results.forEach(({ name, url }) => {
        // Example url: 'https://pokeapi.co/api/v2/pokemon/3/'
        const number = url.split('/').reverse()[1]; // --> 3
        console.log({ name, url, number })

      })
    } catch (error) {
      console.log('Error al realizar l allamada GET');
      throw error;
    }
  }
}
