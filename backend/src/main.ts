import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env values

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend (Next.js)
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
  console.log(`✅ Backend is running on http://localhost:5000`);
}
bootstrap();
