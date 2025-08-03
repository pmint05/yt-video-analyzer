import dotenv from 'dotenv'

dotenv.config();

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: (process.env.NODE_ENV as Config["nodeEnv"]) || 'development'
};

export default config;