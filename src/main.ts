import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder().setTitle('ThorWallet API').setVersion('1.0').build()

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  }

  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('api', app, document)
  app.enableCors()
  await app.listen(process.env.PORT)
}
bootstrap()
