/**
 * Configuration management for SuperUI MCP Server
 */

export interface Config {
  apiBaseUrl?: string;
  timeout?: number;
}

/**
 * Parse command line arguments and environment variables
 * @returns Configuration object
 */
const parseArguments = (): Config => {
  const config: Config = {};

  // Default values
  config.apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3001";
  config.timeout = parseInt(process.env.TIMEOUT || "30000", 10);

  // Parse command line arguments
  process.argv.forEach((arg) => {
    const keyValuePatterns = [
      /^([A-Z_]+)=(.+)$/, // API_BASE_URL=value format
      /^--([A-Z_]+)=(.+)$/, // --API_BASE_URL=value format
      /^\/([A-Z_]+):(.+)$/, // /API_BASE_URL:value format (Windows style)
      /^-([A-Z_]+)[ =](.+)$/, // -API_BASE_URL value or -API_BASE_URL=value format
    ];

    for (const pattern of keyValuePatterns) {
      const match = arg.match(pattern);
      if (match) {
        const [, key, value] = match;
        
        // Strip surrounding quotes from the value
        const cleanValue = value.replaceAll('"', "").replaceAll("'", "");
        
        switch (key) {
          case "API_BASE_URL":
            config.apiBaseUrl = cleanValue;
            break;
          case "TIMEOUT":
            config.timeout = parseInt(cleanValue, 10);
            break;
        }
        break;
      }
    }
  });

  return config;
};

/**
 * Global configuration object
 */
export const config = parseArguments();

/**
 * Log current configuration (for debugging)
 */
export const logConfig = () => {
  console.log("SuperUI MCP Server Configuration:");
  console.log(`  API Base URL: ${config.apiBaseUrl}`);
  console.log(`  Timeout: ${config.timeout}ms`);
};
