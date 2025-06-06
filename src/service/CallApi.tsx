import ApiBaseUrl from "./ApiBaseUrl";

const api1 = import.meta.env.VITE_API_URL;

export async function userApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/user" + url, object);
  const result = response.data;

  return result;
}

export async function playerApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/player" + url, object);
  const result = response.data;

  return result;
}

export async function mainApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/main" + url, object);
  const result = response.data;

  return result;
}

export async function gameProviderApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/game-provider" + url, object);
  const result = response.data;

  return result;
}

export async function deviceApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/device" + url, object);
  const result = response.data;

  return result;
}

export async function bankApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/bank" + url, object);
  const result = response.data;

  return result;
}

export async function staffApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/staff" + url, object);
  const result = response.data;

  return result;
}
export async function LogApi(url: string, object: object) {
  const response = await ApiBaseUrl(api1).post("/api/log" + url, object);
  const result = response.data;

  return result;
}
