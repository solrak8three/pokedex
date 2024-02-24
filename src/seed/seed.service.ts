import fetch from 'node-fetch';
import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  async executedSeed() {
    await this.pokemonModel.deleteMany({});
    try {
      const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650');
      if (!resp.ok) {
        throw new BadRequestException('Error al realizar la petición.')
      }
      const data = resp.json() as Promise<PokeResponse>;

      const pokemonToInsert: { name: string, no: number }[] = [];

      (await data).results.forEach(async ({ name, url }) => {
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

  /* Version anterior
  async executedSeed() {
    await this.pokemonService.deleteMany();
    try {
      const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      if (!resp.ok) {
        throw new BadRequestException('Error al realizar la petición.')
      }
      const data = resp.json() as Promise<PokeResponse>;
      const insertPromiseArray = [];
      (await data).results.forEach(async ({ name, url }) => {
        // Example url: 'https://pokeapi.co/api/v2/pokemon/3/'
        const no = +(url.split('/').reverse()[1]); // --> 3
        insertPromiseArray.push(
          this.pokemonService.create({ name, no })
        );

        Promise.all(insertPromiseArray);
      })
      return 'Seed Executed';
    } catch (error) {
      console.log('Error al realizar l allamada GET');
      throw error;
    }
  }
  */
}
