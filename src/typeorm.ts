import { DataSource } from "typeorm";
import { config } from 'dotenv';

config();

const connectDB = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as any),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/models/*.{js,ts}'],
  synchronize: false, // set to false in production
  logging: true
})

connectDB
  .initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch(() => {
    console.log('Database initialization error');
  });

export default connectDB;