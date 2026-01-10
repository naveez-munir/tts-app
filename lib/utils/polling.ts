/**
 * Polling Utility
 * Used to poll for booking status after payment
 */

export interface PollOptions<T> {
  /** Function that fetches the data */
  fetcher: () => Promise<T>;
  /** Function that checks if the condition is met */
  condition: (data: T) => boolean;
  /** Interval between polls in milliseconds (default: 2000) */
  intervalMs?: number;
  /** Maximum number of attempts (default: 30) */
  maxAttempts?: number;
  /** Callback for each poll attempt */
  onAttempt?: (attempt: number, data: T) => void;
}

export interface PollResult<T> {
  success: boolean;
  data: T | null;
  attempts: number;
  timedOut: boolean;
}

/**
 * Poll until a condition is met or timeout is reached
 * 
 * @example
 * const result = await pollUntil({
 *   fetcher: () => getBookingById(bookingId),
 *   condition: (booking) => booking.status === 'PAID',
 *   intervalMs: 2000,
 *   maxAttempts: 30,
 * });
 */
export async function pollUntil<T>(options: PollOptions<T>): Promise<PollResult<T>> {
  const {
    fetcher,
    condition,
    intervalMs = 2000,
    maxAttempts = 30,
    onAttempt,
  } = options;

  let attempts = 0;
  let lastData: T | null = null;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const data = await fetcher();
      lastData = data;

      if (onAttempt) {
        onAttempt(attempts, data);
      }

      if (condition(data)) {
        return {
          success: true,
          data,
          attempts,
          timedOut: false,
        };
      }
    } catch (error) {
      console.error(`Polling attempt ${attempts} failed:`, error);
      // Continue polling even if individual request fails
    }

    // Wait before next attempt (unless this was the last attempt)
    if (attempts < maxAttempts) {
      await sleep(intervalMs);
    }
  }

  return {
    success: false,
    data: lastData,
    attempts,
    timedOut: true,
  };
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

