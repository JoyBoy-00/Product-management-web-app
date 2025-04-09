import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend (Next.js)
  app.enableCors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
