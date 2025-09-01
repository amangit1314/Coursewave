// verifySocketToken.ts
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

export function verifySocketToken(socket: Socket, next: (err?: ExtendedError) => void) {
  try {
    // Option 1: From query params
    const token = socket.handshake.auth?.token 
      || socket.handshake.query?.token 
      || socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };

    // Attach user data to socket for later use
    socket.data.userId = decoded.id;
    socket.data.email = decoded.email;

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
}
