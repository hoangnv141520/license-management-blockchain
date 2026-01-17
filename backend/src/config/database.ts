import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { DoanhNghiep } from '../models/DoanhNghiep';
import { HoSo } from '../models/HoSo';
import { GiayPhep } from '../models/GiayPhep';
import { LoaiTaiLieu } from '../models/LoaiTaiLieu';
import { TaiLieu } from '../models/TaiLieu';
import { HoSoTaiLieu } from '../models/HoSoTaiLieu';
import { User } from '../models/User';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbName = process.env.DB_NAME || 'kmaerm_db';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  models: [DoanhNghiep, HoSo, GiayPhep, LoaiTaiLieu, TaiLieu, HoSoTaiLieu, User],
  logging: false,
  timezone: '+07:00',
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL (via Sequelize) successfully');
    // Sync models with database (be careful in production)
    await sequelize.sync({ alter: true }); 
  } catch (error) {
    console.error('❌ Cannot connect to DB:', error);
    process.exit(1);
  }
};

export default sequelize;
