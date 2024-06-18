import { config } from '../app/config/index.js';
import { Sequelize } from "sequelize";


// Initialize a new Sequelize instance
const sequelize = new Sequelize(config.pdDatabase);

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
  }
}

connectDb();

export { sequelize, connectDb };

