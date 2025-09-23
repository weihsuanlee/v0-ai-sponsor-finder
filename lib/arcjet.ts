import arcjet, { tokenBucket, shield } from "@arcjet/next"

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Shield protection against common attacks
    shield({
      mode: "LIVE", // Block malicious requests
    }),
    // Rate limiting for AI API endpoints to protect OpenAI quota
    tokenBucket({
      mode: "LIVE", // Block requests that exceed limits
      refillRate: 10, // Allow 10 requests per interval
      interval: 60, // Per 60 seconds (1 minute)
      capacity: 20, // Burst capacity of 20 requests
    }),
  ],
})

export default aj
