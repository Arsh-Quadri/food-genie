import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// Function to load environment variables from .env file
const loadEnv = () => {
  const env = {};
  const envFile = fs.readFileSync(".env", "utf8");
  envFile.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    env[key] = value;
  });
  return env;
};

// Load environment variables
const env = loadEnv();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Pass environment variables to client-side code
    "process.env": JSON.stringify(env),
  },
});
