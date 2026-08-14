import client from "./client";

export const authApi = {
  signup: (payload) => client.post("/api/auth/signup", payload).then((r) => r.data),
  login: (payload) => client.post("/api/auth/login", payload).then((r) => r.data),
};

export const userApi = {
  getMe: () => client.get("/users/me").then((r) => r.data),
  completeProfile: (payload) =>
    client.put("/users/complete-profile", payload).then((r) => r.data),
};
