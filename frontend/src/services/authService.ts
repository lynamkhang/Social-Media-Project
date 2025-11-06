import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    fullName: string
  ) => {
    const res = await api.post(
      "/auth/signup",
      { username, password, email, fullName },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (identifier: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      { identifier, password },
      { withCredentials: true }
    );

    return res.data; //accessToken
  },

  signOut: async () => {
    return api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },
};
