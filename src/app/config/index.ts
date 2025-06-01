import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join((process.cwd(), '.env')),
});

export default {
  port: process.env.PORT,
  database_url: process.env.DATA_BASE_URL,
  node_env: process.env.NODE_ENV,
  // bcrypt_solt: process.env.BCRYPT_SOLT,
  // jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  // access_token_expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
};
