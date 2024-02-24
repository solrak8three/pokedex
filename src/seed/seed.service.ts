import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { FetchAdapter } from 'src/common/adapters/fetch-adapter';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: FetchAdapter,
  ) { }

  async executedSeed() {
    await this.pokemonModel.deleteMany({});
    try {
      const resp: PokeResponse = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
      const pokemonToInsert: { name: string, no: number }[] = [];
      resp.results.forEach(async ({ name, url }) => {
        // Example url: 'https://pokeapi.co/api/v2/pokemon/3/'
        const no = +(url.split('/').reverse()[1]); // --> 3
        pokemonToInsert.push({ name, no });
        await this.pokemonModel.insertMany(pokemonToInsert);
      })
      return 'Seed Executed';
    } catch (error) {
      console.log('Error al realizar l allamada GET');
      throw error;
    }
  }
}
