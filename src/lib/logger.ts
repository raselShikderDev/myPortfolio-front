/**
 * Centralized Logger Utility
 *
 * This utility provides conditional logging based on NODE_ENV:
 * - Development: logs all levels (log, warn, error)
 * - Production: only logs errors
 *
 * Usage: import { logger } from "@/lib/logger";
 */

export const logger = {
  /**
   * Log informational messages
   * Only logs in development mode
   */
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },

  /**
   * Log warning messages
   * Only logs in development mode
   */
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },

  /**
   * Log error messages
   * Always logs in all environments (including production)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};