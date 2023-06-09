import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('get')
  async getDataCache() {
    return await this.cacheManager.get('name');
  }
  @Get('set')
  async setDataCache() {
    return await this.cacheManager.set('name', 'Dung', 60 * 15);
  }
  @Get('todos')
  async getTodos() {
    const todos: string = await this.cacheManager.get('todos');
    if (!todos) {
      const res = await this.httpService.axiosRef.get(
        'https://jsonplaceholder.typicode.com/todos?_limit=10',
      );
      await this.cacheManager.set('todos', JSON.stringify(res.data), 60 * 15);
      return res.data;
    } else {
      return JSON.parse(todos);
    }
  }
}
