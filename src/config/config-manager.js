const fs = require("fs");
const path = require("path");
const configSchema = require("./config.schema");
const z = require("zod");

class ConfigManager {
  constructor() {
    this.config = null;
  }

  load() {
    const configPath = path.join(__dirname, "..", "config", "config.json");
    const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    
    try {
      this.config = configSchema.parse(rawConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Configuration validation failed:");
        error.errors.forEach((err) => {
          console.error(`- ${err.path.join(".")}: ${err.message}`);
        });
        throw new Error("Invalid configuration");
      }
      throw error;
    }
    
    return this.config;
  }

  getConfig() {
    if (!this.config) {
      this.load();
    }
    return this.config;
  }
}

module.exports = new ConfigManager(); 