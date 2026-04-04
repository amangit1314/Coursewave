// Polyfill SlowBuffer for Node 25+ where it was removed.
// Required by buffer-equal-constant-time (dependency of jsonwebtoken via jwa).
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
