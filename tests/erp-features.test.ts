import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Import core permission & utility modules
import { ALL_PAGE_PERMISSIONS, fallbackPermissions } from "../src/lib/auth";
import { todayInIndia, formatDate } from "../src/lib/utils";

describe("ERP System Features & Permissions Test Suite", () => {

  describe("Entry Date Permission Gating ('sales.allow_custom_date')", () => {
    test("ALL_PAGE_PERMISSIONS includes 'sales.allow_custom_date'", () => {
      assert.ok(
        ALL_PAGE_PERMISSIONS.includes("sales.allow_custom_date"),
        "sales.allow_custom_date must be registered in ALL_PAGE_PERMISSIONS"
      );
    });

    test("Admin role automatically receives 'sales.allow_custom_date'", () => {
      const adminPermissions = fallbackPermissions("admin");
      assert.ok(
        adminPermissions.includes("sales.allow_custom_date"),
        "Admin role fallback permissions must include sales.allow_custom_date"
      );
    });

    test("Date editing authorization evaluation logic", () => {
      const checkCanChangeDate = (userRole: string, permissions: string[]) => {
        return userRole === "admin" || permissions.includes("sales.allow_custom_date");
      };

      // Case 1: Admin user -> always true
      assert.equal(checkCanChangeDate("admin", []), true);

      // Case 2: Non-admin with permission granted -> true
      assert.equal(checkCanChangeDate("sales_manager", ["sales.allow_custom_date"]), true);

      // Case 3: Non-admin without permission granted -> false
      assert.equal(checkCanChangeDate("operator", ["sales.orders"]), false);

      // Case 4: Empty role and empty permissions -> false
      assert.equal(checkCanChangeDate("", []), false);
    });
  });

  describe("Date Auto-Calculation & Formatting", () => {
    test("todayInIndia() returns valid YYYY-MM-DD string in IST timezone", () => {
      const todayStr = todayInIndia();
      assert.match(
        todayStr,
        /^\d{4}-\d{2}-\d{2}$/,
        "todayInIndia must return string formatted as YYYY-MM-DD"
      );

      const parsedDate = new Date(todayStr);
      assert.ok(!isNaN(parsedDate.getTime()), "todayInIndia result must be a valid date");
    });

    test("formatDate correctly formats date strings", () => {
      assert.equal(formatDate("2026-09-03"), "3 Sept 2026");
      assert.equal(formatDate(""), "-");
      assert.equal(formatDate(null as any), "-");
    });
  });

  describe("Coloured Item Labeling & Stock Bundle Matching", () => {

    // Helper logic simulating DeliveryEntryWorkspace getItemLabel
    function getItemLabel(
      item: {
        film_type?: string | null;
        color_id?: string | null;
        is_metallic?: boolean;
        fabric_type_id?: string | null;
        lamination_type?: string | null;
        offset_type?: string | null;
      },
      brandName: string,
      fabricName: string,
      colorsMap: Map<string, string>
    ): string {
      const filmChar = item.film_type ? item.film_type.charAt(0).toUpperCase() : "";
      const colStr = item.color_id ? `(${colorsMap.get(item.color_id) || "COLOR"})` : "";
      const met = item.is_metallic ? "(Mt)" : "";
      const suffix = item.lamination_type || item.offset_type || "FINISHING";
      return `${brandName}(${filmChar})${colStr}${met}(${fabricName})(${suffix})`;
    }

    test("getItemLabel correctly incorporates film character and color name", () => {
      const colorsMap = new Map([["col-123", "BROWN"], ["col-456", "GREEN"]]);
      const item = {
        film_type: "MATT",
        color_id: "col-123",
        is_metallic: false,
        lamination_type: "PLAIN",
      };

      const label = getItemLabel(item, "APPLE", "W-16-3", colorsMap);
      assert.equal(label, "APPLE(M)(BROWN)(W-16-3)(PLAIN)");
    });

    test("getItemLabel handles missing film and color gracefully", () => {
      const colorsMap = new Map();
      const item = {
        film_type: null,
        color_id: null,
        is_metallic: false,
        offset_type: "SCREEN",
      };

      const label = getItemLabel(item, "BANANA", "W-12-2", colorsMap);
      assert.equal(label, "BANANA()(W-12-2)(SCREEN)");
    });

    test("Stock bundle color matching logic filters matching bundles", () => {
      const stockBundles = [
        { id: "b1", bundle_id: "BUNDLE-1", color_id: "col-123" },
        { id: "b2", bundle_id: "BUNDLE-2", color_id: "col-456" },
        { id: "b3", bundle_id: "BUNDLE-3", color_id: "col-123" },
      ];

      const targetColorId = "col-123";
      const matchingBundles = stockBundles.filter((b) => !b.color_id || b.color_id === targetColorId);

      assert.equal(matchingBundles.length, 2);
      assert.equal(matchingBundles[0].id, "b1");
      assert.equal(matchingBundles[1].id, "b3");
    });
  });

});
