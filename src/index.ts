import 'reflect-metadata';
import express from 'express';
import userRoutes from './routes/user.routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use()
app.use('/api/users', userRoutes);
app.use(cors())

//validate req
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});


