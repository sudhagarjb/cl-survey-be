import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors())
app.use(routes);

//validate req
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});


