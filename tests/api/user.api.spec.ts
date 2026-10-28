import { test, expect } from "@playwright/test";
import {
  createUser,
  deleteUser,
  getAuthHeaders,
  type ApiUser,
  type AuthHeaders,
} from "../../api/user.api";

const newUser: ApiUser = { name: "ApiUser", yearOfBirth: 1990, gender: 2 };
const updatedUser: ApiUser = { name: "ApiUserUpdated", yearOfBirth: 1985, gender: 1 };

let headers: AuthHeaders;
let createdUserIds: string[];

test.beforeEach(async ({ request }) => {
  headers = await getAuthHeaders(request);
  createdUserIds = [];
});

test.afterEach(async ({ request }) => {
  for (const id of createdUserIds) {
    await deleteUser(request, headers, id);
  }
});

test("GET/api/User returns a list of users", async ({ request }) => {
  const userId = await createUser(request, headers, newUser);
  createdUserIds.push(userId);

  const response = await request.get("/api/User", { headers });

  expect(response.status()).toBe(200);
  expect(await response.json()).toContainEqual(expect.objectContaining({ id: userId, ...newUser }));
});

test("POST/api/User creates a new user", async ({ request }) => {
  const response = await request.post("/api/User", { headers, data: newUser });

  expect(response.status()).toBe(200);
  const createdUser = await response.json();
  createdUserIds.push(createdUser.id);
  expect(createdUser).toMatchObject(newUser);
  expect(createdUser.id).toEqual(expect.any(String));
});

test("PUT/api/User/{id} updates an existing user", async ({ request }) => {
  const userId = await createUser(request, headers, newUser);
  createdUserIds.push(userId);

  const response = await request.put(`/api/User/${userId}`, { headers, data: updatedUser });

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject(updatedUser);

  const getResponse = await request.get(`/api/User/${userId}`, { headers });
  expect(getResponse.status()).toBe(200);
  expect(await getResponse.json()).toMatchObject({ id: userId, ...updatedUser });
});

test("DELETE/api/User/{id} removes the user", async ({ request }) => {
  const userId = await createUser(request, headers, newUser);
  createdUserIds.push(userId);

  const response = await request.delete(`/api/User/${userId}`, { headers });

  expect(response.status()).toBe(200);

  const getResponse = await request.get(`/api/User/${userId}`, { headers });
  expect(getResponse.status()).toBe(404);
});
