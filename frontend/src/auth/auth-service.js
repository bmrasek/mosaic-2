import { requestJSON } from "../api/http.js";
import { cachedQuery, clearQueryCache, invalidateCached } from "../api/query-cache.js";

async function authenticate(path, email, password) {
  const user = await requestJSON(path, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  clearQueryCache();
  return user;
}

export const authService = {
  register: (email, password) => authenticate("/auth/register", email, password),
  login: (email, password) => authenticate("/auth/login", email, password),
  me: () => cachedQuery("/auth/me", () => requestJSON("/auth/me"), 30000),
  logout: async () => {
    const result = await requestJSON("/auth/logout", { method: "POST" });
    invalidateCached("/auth/me", "/profile/me");
    return result;
  }
};
