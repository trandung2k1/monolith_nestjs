import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as cluster from 'cluster';
import * as os from 'os';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  retryToStart(app, 10);
}

async function retryToStart(app: INestApplication, retryTime?: number) {
  if (!retryTime) {
    console.log('Không thể khởi chạy máy chủ');
    return;
  }
  try {
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    setTimeout(async () => {
      await retryToStart(app, retryTime--);
    }, 1000);
  }
}

if ((cluster as any).isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    (cluster as any).fork();
  }
  (cluster as any).on('exit', (worker: cluster.Worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    (cluster as any).fork();
  });
} else {
  bootstrap();
}
