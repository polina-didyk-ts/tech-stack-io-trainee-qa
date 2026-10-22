import { test, expect, type APIRequestContext } from "@playwright/test";

const newUser = { name: "ApiUser", yearOfBirth: 1990, gender: 2 };
const updatedUser = { name: "ApiUserUpdated", yearOfBirth: 1985, gender: 1 };

let headers: { Authorization: string };

async function createUser(request: APIRequestContext) {
  const response = await request.post("/api/User", { headers, data: newUser });
  expect(response.status()).toBe(200);
  return (await response.json()).id;
}

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/Auth/login", {
    data: { username: "admin", password: "123" },
  });
  expect(response.status()).toBe(200);

  const { accessToken } = await response.json();
  headers = { Authorization: `Bearer ${accessToken}` };
});

test("GET/api/User returns a list of users", async ({ request }) => {
  const response = await request.get("/api/User", { headers });

  expect(response.status()).toBe(200);
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);
  expect(users[0]).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      yearOfBirth: expect.any(Number),
      gender: expect.any(Number),
    }),
  );
});

test("POST/api/User creates a new user", async ({ request }) => {
  const response = await request.post("/api/User", { headers, data: newUser });

  expect(response.status()).toBe(200);
  const createdUser = await response.json();
  expect(createdUser).toMatchObject(newUser);
  expect(createdUser.id).toEqual(expect.any(String));

  await request.delete(`/api/User/${createdUser.id}`, { headers });
});

test("PUT/api/User/{id} updates an existing user", async ({ request }) => {
  const userId = await createUser(request);

  const response = await request.put(`/api/User/${userId}`, { headers, data: updatedUser });

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject(updatedUser);

  const getResponse = await request.get(`/api/User/${userId}`, { headers });
  expect(getResponse.status()).toBe(200);
  expect(await getResponse.json()).toMatchObject({ id: userId, ...updatedUser });

  await request.delete(`/api/User/${userId}`, { headers });
});

test("DELETE/api/User/{id} removes the user", async ({ request }) => {
  const userId = await createUser(request);

  const response = await request.delete(`/api/User/${userId}`, { headers });

  expect(response.status()).toBe(200);

  const getResponse = await request.get(`/api/User/${userId}`, { headers });
  expect(getResponse.status()).toBe(404);
});
