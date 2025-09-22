import TokenService from "../../core/services/tokenService";

export default {
  getUserSessions: TokenService.getUserSessions,
  revokeToken: TokenService.revokeToken,
  revokeAllUserTokens: TokenService.revokeAllUserTokens,
  rollbackToken: TokenService.rollbackToken,
  refreshAccessToken: TokenService.refreshAccessToken,
  validateTokenSecurity: TokenService.validateTokenSecurity,
  cleanupExpiredTokens: TokenService.cleanupExpiredTokens,
};
