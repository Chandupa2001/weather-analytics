import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { env } from "../config/env.js";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${env.auth0.domain}/.well-known/jwks.json`,
  }),
  audience: env.auth0.audience,
  issuer: `https://${env.auth0.domain}/`,
  algorithms: ["RS256"],
});
