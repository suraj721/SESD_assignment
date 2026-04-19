import "dotenv/config";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is missing in environment variables`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT || 8080),
  mongodbUri: () => getRequiredEnv("MONGODB_URI"),
};
