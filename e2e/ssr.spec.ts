import { type ConsoleMessage, expect, type Page, type Request, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to a path and collect console messages, page errors, and network
 * requests that occur during the navigation.
 */
async function gotoAndCollect(page: Page, path: string) {
    const messages: ConsoleMessage[] = [];
    const errors: Error[] = [];
    const requests: Request[] = [];

    page.on("console", msg => messages.push(msg));
    page.on("pageerror", err => errors.push(err));
    page.on("request", req => requests.push(req));

    await page.goto(path, { waitUntil: "networkidle" });

    return { messages, errors, requests };
}

/**
 * Fetch the raw SSR HTML via the document response
 * and also wait for hydration to complete.
 */
async function gotoAndCapture(page: Page, path: string) {
    const [response] = await Promise.all([
        page.waitForResponse(
            res => res.request().resourceType() === "document" && res.status() === 200,
        ),
        page.goto(path, { waitUntil: "networkidle" }),
    ]);
    expect(response, `Expected a 200 document response for ${path}`).toBeTruthy();
    return response.text();
}

// ---------------------------------------------------------------------------
// Hydration detection
// ---------------------------------------------------------------------------

/** React error codes that correspond to hydration mismatches. */
const HYDRATION_ERROR_CODES = ["418", "419", "422", "423", "425"];

/** Check whether a console error message indicates a hydration problem. */
function isHydrationError(msg: ConsoleMessage): boolean {
    if (msg.type() !== "error") return false;
    return isHydrationText(msg.text());
}

/** Check whether an error message string indicates a hydration problem. */
function isHydrationText(raw: string): boolean {
    const text = raw.toLowerCase();

    // Dev-mode messages
    if (text.includes("hydrat") || text.includes("mismatch") || text.includes("did not match")) {
        return true;
    }

    // Minified React errors in production builds (e.g. "Minified React error #418")
    if (text.includes("minified react error")) {
        return HYDRATION_ERROR_CODES.some(code => text.includes(`#${code}`));
    }

    return false;
}

/**
 * Assert that no hydration errors were captured in the given console messages
 * and page errors.
 */
function expectNoHydrationErrors(messages: ConsoleMessage[], errors: Error[]) {
    const hydrationConsole = messages.filter(isHydrationError);
    const hydrationPageErrors = errors.filter(e => isHydrationText(e.message));

    expect(
        [...hydrationConsole.map(m => m.text()), ...hydrationPageErrors.map(e => e.message)],
        "Should have no hydration errors in console or uncaught exceptions",
    ).toHaveLength(0);
}

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

test.describe("Homepage SSR", () => {
    test("1. console has no hydration errors", async ({ page }) => {
        const { messages, errors } = await gotoAndCollect(page, "/");
        expectNoHydrationErrors(messages, errors);
    });

    test("2. network has no duplicate document requests", async ({ page }) => {
        const { requests } = await gotoAndCollect(page, "/");

        // Exclude redirects (3xx) — only count requests that received a real document
        const docRequests = requests.filter(
            r => r.resourceType() === "document" && r.method() === "GET" && !r.redirectedFrom(),
        );

        expect(docRequests.length, "Only one document request for the page").toBe(1);
    });

    test("3. DOM matches SSR HTML", async ({ page }) => {
        const ssrHtml = await gotoAndCapture(page, "/");

        // SSR HTML must contain the actual rendered content, not the empty placeholder
        expect(ssrHtml).not.toContain("<div id=\"root\"><!--content--></div>");
        expect(ssrHtml).toContain("window.__SSR_STATE__");

        // After hydration, the visible DOM should match the SSR content
        await expect(page.locator("h1")).toHaveText("Rsbuild with React");
        await expect(page.getByText("Start building amazing things with Rsbuild.")).toBeVisible();
    });

    test("4. page is interactive — navigate to todo", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        await page.getByRole("link", { name: "Go to Todo" }).click();
        await page.waitForURL("**/todo");
        await expect(page).toHaveURL(/\/todo$/);
        await expect(page.locator("h2")).toHaveText("Todo List");
    });
});

// ---------------------------------------------------------------------------
// Todo Page
// ---------------------------------------------------------------------------

test.describe("Todo Page SSR", () => {
    test("1. console has no hydration errors", async ({ page }) => {
        const { messages, errors } = await gotoAndCollect(page, "/todo");
        expectNoHydrationErrors(messages, errors);
    });

    test("2. network has no duplicate document requests", async ({ page }) => {
        const { requests } = await gotoAndCollect(page, "/todo");

        const docRequests = requests.filter(
            r => r.resourceType() === "document" && r.method() === "GET" && !r.redirectedFrom(),
        );

        expect(docRequests.length, "Only one document request for the page").toBe(1);
    });

    test("3. DOM matches SSR HTML", async ({ page }) => {
        const ssrHtml = await gotoAndCapture(page, "/todo");

        // Root div must have real SSR content
        expect(ssrHtml).toMatch(/<div id="root">.+<\/div>/s);
        expect(ssrHtml).toContain("window.__SSR_STATE__");

        // After hydration the heading should be visible and match
        await expect(page.locator("h2")).toHaveText("Todo List");
    });

    test("4. page is interactive — add, refresh, delete a todo", async ({ page }) => {
        const title = `E2E-${Date.now()}`;

        await page.goto("/todo", { waitUntil: "networkidle" });

        // --- Add ---
        await page.getByPlaceholder("What do you need to do?").fill(title);
        await page.getByRole("button", { name: "Add" }).click();
        await expect(page.getByText(title)).toBeVisible();

        // --- Refresh (in-app button) ---
        await page.getByRole("button", { name: "Refresh" }).click();
        await expect(page.getByText(title)).toBeVisible();

        // --- Full page reload (SSR round-trip) ---
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.getByText(title)).toBeVisible();

        // --- Delete ---
        await page.getByRole("button", { name: `Delete todo ${title}` }).click();
        await expect(page.getByText(title)).not.toBeVisible();

        // Confirm deletion survives a full reload
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.getByText(title)).not.toBeVisible();
    });
});
