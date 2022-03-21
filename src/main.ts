import { HttpExceptionFilter } from './filters/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import { ifCondition } from './helpers/if-condition.helper';
import { forLoop } from './helpers/for-loop.helper';
import * as helpers from 'handlebars-helpers';
import { queryString } from './helpers/query-string.helpers';
import { hasRole } from './helpers/has-role.helper';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { rateLimit } from 'express-rate-limit';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: 'secret',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  app.use(helmet({contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
      fontSrc: [`'self'`, 'fonts.gstatic.com'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
    },
  }}));
  app.use(csurf({cookie: {key: '_csrf'}}));
  app.use(function (req, res, next) {
    var token = req.csrfToken();
    // res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerHelper('ifCond', ifCondition);
  hbs.registerHelper('for', forLoop);
  hbs.registerHelper('queryString', queryString);
  hbs.registerHelper('hasRole', hasRole);
  helpers.math({handlebars: hbs});
  
  await app.listen(3000);
}
bootstrap();
