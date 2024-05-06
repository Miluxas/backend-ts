import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const nodeEnv = process.env.NODE_ENV;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  let document;

  if (nodeEnv !== 'prod') {
    const VERSION = configService.get('SWAGGER_VERSION');
    const TITLE = configService.get('SWAGGER_TITLE');
    const swaggerOptions = new DocumentBuilder()
      .setTitle(TITLE)
      .setVersion(VERSION)
      .addBearerAuth()
      .setExternalDoc('Postman Collection', '/docs-json')
      .build();
    document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger', app, document);
    SwaggerModule.setup('/docs', app, document);
  }
  await app.listen(+configService.get("PORT"), configService.get("HOST"));
}
bootstrap();
