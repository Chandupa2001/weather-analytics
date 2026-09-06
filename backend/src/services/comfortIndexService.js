/**
 * Comfort Index Score
 * ---------------------------------------------------------------
 * Produces a single 0-100 score describing how pleasant it would
 * feel to be outdoors right now, from four independent parameters:
 *
 *   - Temperature   (35%)  -> biggest driver of perceived comfort
 *   - Humidity      (25%)  -> muggy air feels worse than dry air
 *   - Wind speed    (25%)  -> gentle breeze is pleasant, gusts are not
 *   - Cloud cover   (15%)  -> a little shade helps, full overcast is gloomy
 *
 * Each parameter is converted to its own 0-100 sub-score using a
 * "distance from an ideal band" curve, then combined with weights
 * that reflect how strongly it drives how a person actually feels
 * standing outside. The weights and bands are explained in the
 * project README under "The Comfort Index formula".
 * ---------------------------------------------------------------
 */

const WEIGHTS = {
  temperature: 0.35,
  humidity: 0.25,
  wind: 0.25,
  cloud: 0.15,
};

/** Clamp a number between min and max. */
function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score a value against an ideal [low, high] band.
 * Inside the band -> 100. Outside the band, score falls off
 * linearly at `falloffPerUnit` points per unit of distance,
 * down to a minimum of 0.
 */
function bandScore(value, low, high, falloffPerUnit) {
  if (value >= low && value <= high) return 100;
  const distance = value < low ? low - value : value - high;
  return clamp(100 - distance * falloffPerUnit, 0, 100);
}

/** Temperature in Celsius. Ideal range: 18-24C (typical indoor-comfort band). */
function temperatureScore(tempC) {
  return bandScore(tempC, 18, 24, 4.5);
}

/** Relative humidity in %. Ideal range: 30-55%. Above this it feels muggy. */
function humidityScore(humidityPct) {
  return bandScore(humidityPct, 30, 55, 1.6);
}

/** Wind speed in m/s. Ideal range: 0-3.5 m/s (light air to light breeze). */
function windScore(windSpeedMs) {
  return bandScore(windSpeedMs, 0, 3.5, 9);
}

/** Cloud cover in %. Ideal range: 10-50% (some shade, still bright). */
function cloudScore(cloudPct) {
  return bandScore(cloudPct, 10, 50, 0.9);
}

/**
 * @param {Object} weather
 * @param {number} weather.tempC        Temperature in Celsius
 * @param {number} weather.humidity     Relative humidity, %
 * @param {number} weather.windSpeedMs  Wind speed, m/s
 * @param {number} weather.cloudPct     Cloudiness, %
 * @returns {{score: number, breakdown: Object, weights: Object}}
 */
export function computeComfortIndex({ tempC, humidity, windSpeedMs, cloudPct }) {
  const breakdown = {
    temperature: Math.round(temperatureScore(tempC)),
    humidity: Math.round(humidityScore(humidity)),
    wind: Math.round(windScore(windSpeedMs)),
    cloud: Math.round(cloudScore(cloudPct)),
  };

  const weighted =
    breakdown.temperature * WEIGHTS.temperature +
    breakdown.humidity * WEIGHTS.humidity +
    breakdown.wind * WEIGHTS.wind +
    breakdown.cloud * WEIGHTS.cloud;

  return {
    score: Math.round(clamp(weighted, 0, 100)),
    breakdown,
    weights: WEIGHTS,
  };
}

export const _internal = { bandScore, temperatureScore, humidityScore, windScore, cloudScore };
