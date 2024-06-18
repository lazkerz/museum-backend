import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import session from 'express-session';
import { config } from './app/config/index.js';
import { routes } from './app/routes/index.routes.js';
import { relations } from './app/models/relations.models.js';

const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000', // Atur origin sesuai dengan domain frontend Anda
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Atur metode HTTP yang diizinkan
//   allowedHeaders: ['Content-Type', 'Authorization'], // Atur header yang diizinkan
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use('/api/v1', routes);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error in JSON format
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
});

relations();

export default app;
