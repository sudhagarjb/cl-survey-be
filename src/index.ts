import 'reflect-metadata';
import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});


