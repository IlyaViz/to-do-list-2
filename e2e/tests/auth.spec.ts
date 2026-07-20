import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("Should show errors on invalid registration format", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.fill("#register-email", "not-an-email");
    await page.fill("#register-password", "short");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Invalid email format")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 8 characters"),
    ).toBeVisible();
  });

  test("Should show error on already registered email", async ({ page }) => {
    const testEmail = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto("/register");
    await page.fill("#register-email", testEmail);
    await page.fill("#register-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");

    await page.click('button:has-text("Logout")');

    await expect(page).toHaveURL("/login");

    await page.goto("/register");
    await page.fill("#register-email", testEmail);
    await page.fill("#register-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Email already registered")).toBeVisible();
  });

  test("Should register successfully and redirect to dashboard", async ({
    page,
  }) => {
    const testEmail = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto("/register");
    await page.fill("#register-email", testEmail);
    await page.fill("#register-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("My Tasks")).toBeVisible();
  });

  test("Should show error on invalid login", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#login-email", "ghost@example.com");
    await page.fill("#login-password", "WrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("Should login successfully and logout", async ({ page }) => {
    const testEmail = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto("/register");
    await page.fill("#register-email", testEmail);
    await page.fill("#register-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");

    await page.click('button:has-text("Logout")');

    await expect(page).toHaveURL("/login");

    await page.fill("#login-email", testEmail);
    await page.fill("#login-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });
});
