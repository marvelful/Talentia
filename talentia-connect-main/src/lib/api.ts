export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(
  path: string,
  options: RequestInit & { auth?: string | null } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    // No credentials needed: we use Bearer tokens in headers, not cookies
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(headers || {}),
    },
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (body: unknown) => request<{ accessToken: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    login: (body: unknown) => request<{ accessToken: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    me: (token: string) => request("/auth/me", { auth: token }),
  },
  marketplace: {
    listGigs: () => request<any[]>("/gigs", { method: "GET" }),
    createGig: (body: unknown, token: string) =>
      request<any>("/gigs", {
        method: "POST",
        body: JSON.stringify(body),
        auth: token,
      }),
    listMyGigs: (token: string) =>
      request<any[]>("/gigs/my", {
        method: "GET",
        auth: token,
      }),
    applyToGig: (gigId: string, body: unknown, token: string) =>
      request<any>(`/gigs/${gigId}/apply`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: token,
      }),
    listApplications: (gigId: string, token: string) =>
      request<any[]>(`/gigs/${gigId}/applications`, {
        method: "GET",
        auth: token,
      }),
  },
  library: {
    listCategories: () => request<any[]>("/library/categories", { method: "GET" }),
    listResources: () => request<any[]>("/library/resources", { method: "GET" }),
  },
  courses: {
    list: () => request<any[]>("/courses", { method: "GET" }),
    get: (courseId: string) => request<any>(`/courses/${courseId}`, { method: "GET" }),
  },
  mentorship: {
    listMentors: () => request<any[]>("/mentors", { method: "GET" }),
  },
  portfolio: {
    getMe: (token: string) => request<any>("/portfolio/me", { auth: token }),
  },
};
