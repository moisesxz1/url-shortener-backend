import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UrlService } from './urls/url.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const urlService = app.get(UrlService);

  // Seed the database with 10 fake URLs
  for (let i = 0; i < 10; i++) {
    const originalUrl = faker.internet.url();

    const shortenedUrl = await urlService.shortenUrl(originalUrl);
    await urlService.findOriginalUrl(shortenedUrl);
  }

  console.log('Database seeding completed.');
  await app.close();
}

bootstrap();
