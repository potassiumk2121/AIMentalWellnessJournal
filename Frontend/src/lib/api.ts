export const API_BASE = "http://127.0.0.1:8000";

export const api = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    // Handle DRF error formats: {detail: "..."}, {non_field_errors: [...]}, {field: [...]}
    const message =
      error.detail ||
      error.non_field_errors?.[0] ||
      error.error ||
      Object.values(error).flat()[0] ||
      "API Error";
    throw new Error(String(message));
  }

  // Handle empty responses (e.g. 201 Created, 204 No Content)
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text);
};