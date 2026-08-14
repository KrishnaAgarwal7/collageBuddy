import client from "./client";

export const eventsApi = {
  list: () => client.get("/events").then((r) => r.data.events),
  create: (payload) => client.post("/events", payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/events/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/events/${id}`).then((r) => r.data),
};
