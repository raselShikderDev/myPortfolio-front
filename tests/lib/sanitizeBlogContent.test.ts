import { sanitizeBlogContent, getPlainTextFromHtml, generateSeoDescription } from "@/lib/utils/sanitizeBlogContent";
import { describe, expect, test } from "bun:test";

describe("sanitizeBlogContent", () => {
  test("should allow valid HTML", () => {
    const validHtml = "<p>Hello <strong>world</strong></p><h2>Heading</h2><ul><li>Item</li></ul><blockquote>Quote</blockquote><code>const x = 1;</code><a href=\"https://example.com\">Example</a>";
    const sanitized = sanitizeBlogContent(validHtml);
    expect(sanitized).toContain("<p>Hello <strong>world</strong></p>");
    expect(sanitized).toContain("<h2>Heading</h2>");
    expect(sanitized).toContain("<ul><li>Item</li></ul>");
    expect(sanitized).toContain("<blockquote>Quote</blockquote>");
    expect(sanitized).toContain("<code>const x = 1;</code>");
    expect(sanitized).toContain("<a href=\"https://example.com\">Example</a>");
  });

  test("should remove malicious content", () => {
    const maliciousHtml = "<script>alert(1)</script><img src=x onerror=alert(1)><p onclick=\"alert(1)\">Hello</p><a href=\"javascript:alert(1)\">Click</a><a href=\"vbscript:alert(1)\">Click</a><a href=\"data:text/html,test\">Click</a><iframe src=\"https://example.com\"></iframe><style>body{display:none}</style>";
    const sanitized = sanitizeBlogContent(maliciousHtml);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("onerror");
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("javascript:");
    expect(sanitized).not.toContain("vbscript:");
    expect(sanitized).not.toContain("data:text/html");
    expect(sanitized).not.toContain("<iframe");
    expect(sanitized).not.toContain("<style");
  });
});

describe("getPlainTextFromHtml", () => {
  test("should convert HTML to plain text", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    const plainText = getPlainTextFromHtml(html);
    expect(plainText).toBe("Hello world");
  });

  test("should handle multiple whitespace", () => {
    const html = "<p>Hello    world</p>";
    const plainText = getPlainTextFromHtml(html);
    expect(plainText).toBe("Hello world");
  });

  test("should trim whitespace", () => {
    const html = "<p>  Hello world  </p>";
    const plainText = getPlainTextFromHtml(html);
    expect(plainText).toBe("Hello world");
  });
});

describe("generateSeoDescription", () => {
  test("should truncate long text", () => {
    const longText = "a".repeat(200);
    const description = generateSeoDescription(longText);
    expect(description).toHaveLength(153);
    expect(description).toEndWith("...");
  });

  test("should not truncate short text", () => {
    const shortText = "Short text";
    const description = generateSeoDescription(shortText);
    expect(description).toBe(shortText);
    expect(description).not.toContain("...");
  });
});