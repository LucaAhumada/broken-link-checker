const { z } = require('zod');

const configSchema = z.object({
  startUrl: z.string().url(),
  maxDepth: z.number().int().min(0),
  timeout: z.number().int().min(0),
  followRedirects: z.boolean(),
  checkExternalLinks: z.boolean(),
  userAgent: z.string(),
  excludePatterns: z.array(z.string()),
  outputFile: z.string(),
  retryCount: z.number().int().min(0),
  retryDelay: z.number().int().min(0)
});

module.exports = configSchema; 