import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    json: (context: string) => JSON.stringify(context, null, 2),
  }
}));

app.set('view engine', 'hbs');


app.use("/", routes)


export default app;