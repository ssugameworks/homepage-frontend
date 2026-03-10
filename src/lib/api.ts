import axios from "axios";

export type HelloResponse = {
  message: string;
  method?: string;
};

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getHello(name?: string) {
  const path = name ? `/hello/${encodeURIComponent(name)}` : "/hello";
  const { data } = await api.get<HelloResponse>(path);
  return data;
}
