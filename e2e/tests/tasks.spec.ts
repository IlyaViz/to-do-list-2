import { test, expect } from "@playwright/test";

test.describe("Tasks Management", () => {
  test.beforeEach(async ({ page }) => {
    const testEmail = `taskuser_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto("/register", { waitUntil: "networkidle" });
    await page.fill("#register-email", testEmail);
    await page.fill("#register-password", "StrongPass123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });

  test("Should show validation errors for invalid task data", async ({
    page,
  }) => {
    await page.click('button:has-text("New Task")');
    await page.fill("#task-priority", "15");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Title is required")).toBeVisible();
    await expect(page.getByText("Priority must be at most 10")).toBeVisible();
  });

  test("Should create, complete, and delete a task", async ({ page }) => {
    const taskTitle = "Main E2E Task";

    await page.click('button:has-text("New Task")');
    await page.fill("#task-title", taskTitle);
    await page.fill("#task-priority", "7");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Save Task")).not.toBeVisible();

    const taskCard = page
      .locator(".group.flex.items-start")
      .filter({ hasText: taskTitle })
      .first();

    await expect(taskCard).toBeVisible();

    await taskCard.locator('span[role="checkbox"]').click();

    await expect(taskCard).toHaveClass(/opacity-60/);

    page.once("dialog", (dialog) => dialog.accept());

    await taskCard.locator("button[data-slot='dropdown-menu-trigger']").click();
    await page.getByText("Delete", { exact: true }).click();

    await expect(taskCard).not.toBeVisible();
    await expect(page.getByText("No tasks found.")).toBeVisible();
  });

  test("Should create a subtask successfully", async ({ page }) => {
    const parentTitle = "Parent Task";
    const subtaskTitle = "Child Subtask";

    await page.click('button:has-text("New Task")');
    await page.fill("#task-title", parentTitle);
    await page.click('button[type="submit"]');

    await expect(page.getByText("Save Task")).not.toBeVisible();

    const parentCard = page
      .locator(".group.flex.items-start")
      .filter({ hasText: parentTitle })
      .first();

    await expect(parentCard).toBeVisible();

    await parentCard
      .locator("button[data-slot='dropdown-menu-trigger']")
      .click();
    await page.getByText("Add Subtask", { exact: true }).click();

    await page.fill("#task-title", subtaskTitle);
    await page.click('button[type="submit"]');

    await expect(page.getByText("Save Task")).not.toBeVisible();

    const subtaskCard = page
      .locator(".group.flex.items-start")
      .filter({ hasText: subtaskTitle })
      .first();

    await expect(subtaskCard).toBeVisible();
    await expect(subtaskCard).toHaveClass(/ml-8/);
  });

  test("Should filter, search and sort tasks", async ({ page }) => {
    await page.click('button:has-text("New Task")');
    await page.fill("#task-title", "Done Task");
    await page.fill("#task-priority", "4");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Save Task")).not.toBeVisible();

    await page.click('button:has-text("New Task")');
    await page.fill("#task-title", "Undone Task");
    await page.fill("#task-priority", "2");
    await page.click('button[type="submit"]');

    const doneTaskCard = page
      .locator(".group.flex.items-start")
      .filter({ hasText: "Done Task" })
      .first();
    await doneTaskCard.locator('span[role="checkbox"]').click();
    await expect(doneTaskCard).toHaveClass(/opacity-60/);

    await page.click('button:has-text("all")');
    await page.getByText("Done", { exact: true }).click();

    await expect(page.getByText("Done Task", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Undone Task", { exact: true }),
    ).not.toBeVisible();

    await page.click('button:has-text("done")');
    await page.getByText("All Tasks", { exact: true }).click();

    await page.fill('input[placeholder="Search tasks..."]', "Undone");

    await expect(page.getByText("Undone Task", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Done Task", { exact: true }),
    ).not.toBeVisible();

    await page.fill('input[placeholder="Search tasks..."]', "");

    const taskCards = page.locator(".group.flex.items-start");

    await page.click('button:has-text("Priority")');
    await expect(taskCards.nth(0)).toContainText("P4");
    await expect(taskCards.nth(1)).toContainText("P2");

    await page.click('button:has-text("Priority")');
    await expect(taskCards.nth(0)).toContainText("P2");
    await expect(taskCards.nth(1)).toContainText("P4");
  });
});
