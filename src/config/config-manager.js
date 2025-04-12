const fs = require("fs");
const path = require("path");

class ConfigManager {
  constructor() {
    this.config = null;
  }

  load() {
    const configPath = path.join(__dirname, "..", "config", "config.json");
    this.config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
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