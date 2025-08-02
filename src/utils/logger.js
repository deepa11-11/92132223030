export const logEvent = (eventType, details) => {
  const log = {
    timestamp: new Date().toISOString(),
    eventType,
    details
  };
  // Middleware simulation: Send logs to localStorage or external endpoint
  console.log("LOGGED EVENT (middleware):", log);
  // In production, push this to logging backend instead of console
};
