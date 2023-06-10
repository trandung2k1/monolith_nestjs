import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cluster, { Worker } from 'cluster';
import * as os from 'os';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://localhost:${port}`);
}
//cluster not working docker
if (cluster?.isMaster) {
  const cores = os.cpus().length;
  console.log(`Total cores: ${cores}`);
  console.log(`Primary process ${process.pid} is running`);
  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker: Worker) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    cluster.fork();
  });
} else {
  bootstrap();
}
