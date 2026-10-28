import { expect, type APIRequestContext } from "@playwright/test";

export type AuthHeaders = { Authorization: string };

export type ApiUser = { name: string; yearOfBirth: number; gender: number };

export async function getAuthHeaders(request: APIRequestContext): Promise<AuthHeaders> {
  const response = await request.post("/api/Auth/login", {
    data: { username: "admin", password: "123" },
  });
  expect(response.status(), "Login as admin failed").toBe(200);

  const { accessToken } = await response.json();
  return { Authorization: `Bearer ${accessToken}` };
}

export async function createUser(
  request: APIRequestContext,
  headers: AuthHeaders,
  user: ApiUser,
): Promise<string> {
  const response = await request.post("/api/User", { headers, data: user });
  expect(response.status(), "Precondition failed: user was not created").toBe(200);

  return (await response.json()).id;
}

export async function deleteUser(request: APIRequestContext, headers: AuthHeaders, id: string) {
  await request.delete(`/api/User/${id}`, { headers });
}

export async function deleteUsersByName(
  request: APIRequestContext,
  headers: AuthHeaders,
  name: string,
) {
  const response = await request.get("/api/User", { headers });
  const users: { id: string; name: string }[] = await response.json();

  for (const user of users.filter((u) => u.name === name)) {
    await deleteUser(request, headers, user.id);
  }
}
