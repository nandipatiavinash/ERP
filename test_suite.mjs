// Test Suite for Sales and Delivery Updates
// Run using: node test_suite.mjs

// 1. Dynamic Product Spec Name Resolution
function getItemLabel(item, fabrics, rotoProducts, offsetProducts) {
  const getCleanBrand = (brandName) => {
    if (!brandName) return "";
    return brandName.split(" (")[0].trim();
  };

  const fab = fabrics.find((x) => x.id === item.fabric_type_id)?.fabric_name || "FABRIC-TYPE";

  if (item.department === "fabric") {
    const f = fabrics.find((x) => x.id === item.product_id);
    return f ? f.fabric_name.toUpperCase() : "FABRIC PRODUCT";
  }

  if (item.department === "roto-printing") {
    const r = rotoProducts.find((x) => x.id === item.roto_product_id || x.id === item.product_id);
    const brand = getCleanBrand(r?.brand);
    const filmChar = item.film_type === "gloss" ? "G" : item.film_type === "matt" ? "M" : "?";
    const met = item.is_metallic ? "(MT)" : "";
    return `${brand}(${filmChar})${met}`.toUpperCase();
  }

  if (item.department === "lamination") {
    const brand = ["BOX", "F_S", "H_S"].includes(item.lamination_type || "")
      ? getCleanBrand(rotoProducts.find((x) => x.id === item.roto_product_id)?.brand)
      : item.lamination_type === "NW"
      ? "NW"
      : "PLAIN";
    
    let suffix = "";
    if (item.lamination_type === "PLAIN") suffix = "";
    else if (item.lamination_type === "NW") suffix = "";
    else if (item.lamination_type === "BOX") suffix = "B";
    else if (item.lamination_type === "F_S") suffix = "F";
    else if (item.lamination_type === "H_S") suffix = "H";

    if (item.lamination_type === "PLAIN" || item.lamination_type === "NW") {
      return `${brand}(${fab})`.toUpperCase();
    } else {
      return `${brand}(${fab})(${suffix})`.toUpperCase();
    }
  }

  if (item.department === "offset-printing") {
    const o = offsetProducts.find((x) => x.id === item.offset_product_id || x.id === item.product_id);
    const brand = getCleanBrand(o?.brand);
    const subFabName = item.offset_type === "NW" ? "NW" : fab;
    return `${brand}(${subFabName})`.toUpperCase();
  }

  if (item.department === "finishing") {
    const finishType = item.lamination_type ? "LAMINATION" : (item.offset_type !== "none" && item.offset_type ? "OFFSET" : "FABRIC");
    
    if (finishType === "FABRIC") {
      return `PLAIN(${fab})`.toUpperCase();
    } else if (finishType === "LAMINATION") {
      const brand = ["BOX", "F_S", "H_S"].includes(item.lamination_type || "")
        ? getCleanBrand(rotoProducts.find((x) => x.id === item.roto_product_id)?.brand)
        : item.lamination_type === "NW"
        ? "NW"
        : "PLAIN";
      
      let suffix = "";
      if (item.lamination_type === "PLAIN") suffix = "";
      else if (item.lamination_type === "NW") suffix = "";
      else if (item.lamination_type === "BOX") suffix = "B";
      else if (item.lamination_type === "F_S") suffix = "F";
      else if (item.lamination_type === "H_S") suffix = "H";

      if (item.lamination_type === "PLAIN" || item.lamination_type === "NW") {
        return `${brand}(${fab})`.toUpperCase();
      } else {
        return `${brand}(${fab})(${suffix})`.toUpperCase();
      }
    } else {
      // OFFSET
      const brand = getCleanBrand(offsetProducts.find((x) => x.id === item.offset_product_id)?.brand);
      return `${brand}(${fab})`.toUpperCase();
    }
  }

  return "Unknown Item";
}

// 2. Mock Delivery Quantity Calculator (confirmMultipleSalesDeliveries logic)
function calculateDeliveredQty(item, rollIds, rollsData, rollsBagsData) {
  if (item.department === "finishing") {
    return rollIds.reduce((sum, rid) => sum + (rollsBagsData[rid] || 0), 0);
  } else {
    return rollIds.reduce((sum, rid) => sum + (rollsData[rid] || 0), 0);
  }
}

// 3. Mock Confirmation Base Total Calculator (saveSalesConfirmationRates logic)
function calculateBaseTotal(items, rollsData, finishingBagsData, itemPrices) {
  let baseTotal = 0;
  for (const item of items) {
    let qty = 0;
    const selectedIds = item.selected_roll_ids || [];
    if (selectedIds.length > 0) {
      selectedIds.forEach((rid) => {
        if (item.department === "finishing") {
          qty += finishingBagsData[rid] || 0;
        } else {
          qty += rollsData[rid] || 0;
        }
      });
    } else {
      qty = Number(item.quantity || 0);
    }
    const price = Number(itemPrices[item.id] ?? item.price ?? 0);
    baseTotal += qty * price;
  }
  return baseTotal;
}

// 4. Mock Print Columns Evaluator (sales-print-view logic)
function evaluatePrintColumns(productKeys, departmentsByProduct) {
  const hasFabric = productKeys.some((k) => departmentsByProduct[k] === "fabric");
  const hasFinishing = productKeys.some((k) => departmentsByProduct[k] === "finishing");
  return { hasFabric, hasFinishing };
}

// --- Test Implementation ---

const fabrics = [{ id: "fab-1", fabric_name: "75 GSM WHITE" }];
const rotoProducts = [{ id: "roto-1", brand: "SANGAM-POWER (W-28-4)" }];
const offsetProducts = [{ id: "offset-1", brand: "SWAPNA-SPECIAL" }];

let failures = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
  } else {
    console.error(`FAIL: ${message}`);
    failures++;
  }
}

// Test Group 1: Spec Name Resolution
console.log("\n--- Testing Group 1: Dynamic Name Resolution ---");
assert(
  getItemLabel({ department: "fabric", product_id: "fab-1" }, fabrics, rotoProducts, offsetProducts) === "75 GSM WHITE",
  "Fabric item resolves fabric_name"
);
assert(
  getItemLabel({ department: "roto-printing", product_id: "roto-1", film_type: "gloss", is_metallic: true }, fabrics, rotoProducts, offsetProducts) === "SANGAM-POWER(G)(MT)",
  "Roto metallic item resolves brand and suffix"
);
assert(
  getItemLabel({ department: "finishing", offset_type: "FABRIC", offset_product_id: "offset-1", fabric_type_id: "fab-1" }, fabrics, rotoProducts, offsetProducts) === "SWAPNA-SPECIAL(75 GSM WHITE)",
  "Finishing offset item resolves brand and fabric type spec"
);

// Test Group 2: Delivery Confirmation Quantity logic
console.log("\n--- Testing Group 2: Delivery Quantity (Bags vs Weight) ---");
const rollsData = { "roll-1": 150.5, "bundle-1": 2246.0 };
const rollsBagsData = { "bundle-1": 16875 };

assert(
  calculateDeliveredQty({ department: "fabric" }, ["roll-1"], rollsData, rollsBagsData) === 150.5,
  "Fabric item delivery uses weight (150.5 kg)"
);
assert(
  calculateDeliveredQty({ department: "finishing" }, ["bundle-1"], rollsData, rollsBagsData) === 16875,
  "Finishing item delivery uses bags (16875 bags)"
);

// Test Group 3: Save Rates Ledger total
console.log("\n--- Testing Group 3: Save Rates Total Base Value ---");
const items = [
  { id: "item-1", department: "fabric", selected_roll_ids: ["roll-1"], price: 10 },
  { id: "item-2", department: "finishing", selected_roll_ids: ["bundle-1"], price: 20 }
];
const itemPrices = { "item-1": 10, "item-2": 20 };

// Expected base total: (150.5 kg * 10) + (16875 bags * 20) = 1505 + 337500 = 339005
const baseTotal = calculateBaseTotal(items, rollsData, rollsBagsData, itemPrices);
assert(
  baseTotal === 339005,
  `Base total calculation matches expected: 339005 (got ${baseTotal})`
);

// Test Group 4: Print Columns Evaluator
console.log("\n--- Testing Group 4: Invoice Print Column Toggling ---");
assert(
  evaluatePrintColumns(["PLAIN(75 GSM WHITE)"], { "PLAIN(75 GSM WHITE)": "fabric" }).hasFabric === true,
  "Fabric bill shows Gross/Core columns"
);
assert(
  evaluatePrintColumns(["SANGAM-POWER(NW)"], { "SANGAM-POWER(NW)": "finishing" }).hasFabric === false,
  "Finishing-only bill hides Gross/Core columns"
);
assert(
  evaluatePrintColumns(["SANGAM-POWER(NW)"], { "SANGAM-POWER(NW)": "finishing" }).hasFinishing === true,
  "Finishing bill toggles header to Bags"
);

console.log("\n-------------------------------------------");
if (failures === 0) {
  console.log("All tests in testsuite passed successfully!");
} else {
  console.error(`${failures} test(s) failed in testsuite.`);
  process.exit(1);
}
