export const useLocalStorage = () => {
  const setToken = (token: string, tokenKey: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(tokenKey, token);
    }
  };
  const getToken = (tokenKey: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(tokenKey) || null;
    }
    return null;
  };

  const removeToken = (tokenKey: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(tokenKey);
    }
  };

  return { setToken, getToken, removeToken };
};
