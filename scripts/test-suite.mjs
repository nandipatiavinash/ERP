import test from "node:test";
import assert from "node:assert";

// Helper function implementing page.tsx base balance logic
function getProcessedOpeningBalances(from, to, selectedAccount) {
  let totalDebit = 0;
  let totalCredit = 0;

  // Mock get_opening_balance RPC result (e.g. cumulative transactions before from)
  const historicalDebit = selectedAccount.historicalDebit || 0;
  const historicalCredit = selectedAccount.historicalCredit || 0;

  totalDebit += historicalDebit;
  totalCredit += historicalCredit;

  // If starting after 01st June 2026, roll the base opening balance into the starting opening balance
  if (from > "2026-06-01") {
    totalDebit += Number(selectedAccount.opening_debit ?? 0);
    totalCredit += Number(selectedAccount.opening_credit ?? 0);
  }

  // Construct virtual entries dated before 'from' to represent the opening balance in the frontend
  const virtualEntries = [];
  const startNet = totalDebit - totalCredit;
  const startDr = startNet > 0 ? startNet : 0;
  const startCr = startNet < 0 ? Math.abs(startNet) : 0;

  if (startDr > 0) {
    virtualEntries.push({
      id: "virtual-dr",
      entry_date: "1970-01-01",
      entry_type: "debit",
      amount: startDr,
      description: "Opening Balance"
    });
  }
  if (startCr > 0) {
    virtualEntries.push({
      id: "virtual-cr",
      entry_date: "1970-01-01",
      entry_type: "credit",
      amount: startCr,
      description: "Opening Balance"
    });
  }

  // If starting on or before 01st June 2026 and range covers it, show base opening balance as a line item on 2026-06-01
  const baseOpeningEntries = [];
  if (from <= "2026-06-01" && to >= "2026-06-01") {
    const baseDebit = Number(selectedAccount.opening_debit ?? 0);
    const baseCredit = Number(selectedAccount.opening_credit ?? 0);
    const baseNet = baseDebit - baseCredit;
    const baseDr = baseNet > 0 ? baseNet : 0;
    const baseCr = baseNet < 0 ? Math.abs(baseNet) : 0;

    if (baseDr > 0) {
      baseOpeningEntries.push({
        id: "virtual-base-dr",
        entry_date: "2026-06-01",
        entry_type: "debit",
        amount: baseDr,
        description: "Opening Balance (Base)"
      });
    }
    if (baseCr > 0) {
      baseOpeningEntries.push({
        id: "virtual-base-cr",
        entry_date: "2026-06-01",
        entry_type: "credit",
        amount: baseCr,
        description: "Opening Balance (Base)"
      });
    }
  }

  return { virtualEntries, baseOpeningEntries };
}

// 1. Date Placement Edge Cases
test("opening balance virtual entries date placement - Edge Cases", () => {
  const selectedAccount = {
    opening_debit: 10000,
    opening_credit: 2000,
    historicalDebit: 5000,
    historicalCredit: 1000
  };

  // Case A: Date range starts exactly on 2026-06-01
  const resExact = getProcessedOpeningBalances("2026-06-01", "2026-06-30", selectedAccount);
  assert.strictEqual(resExact.virtualEntries.length, 1);
  assert.strictEqual(resExact.virtualEntries[0].amount, 4000); // 5000 - 1000 historical
  assert.strictEqual(resExact.baseOpeningEntries.length, 1);
  assert.strictEqual(resExact.baseOpeningEntries[0].amount, 8000); // 10000 - 2000 base balance as line item on 2026-06-01

  // Case B: Date range starts before 2026-06-01 (e.g. 2026-05-15) and ends after (2026-06-15)
  const resBeforeAndAfter = getProcessedOpeningBalances("2026-05-15", "2026-06-15", selectedAccount);
  assert.strictEqual(resBeforeAndAfter.virtualEntries[0].amount, 4000);
  assert.strictEqual(resBeforeAndAfter.baseOpeningEntries[0].amount, 8000);

  // Case C: Date range starts after 2026-06-01 (e.g. 2026-06-02)
  const resAfter = getProcessedOpeningBalances("2026-06-02", "2026-06-30", selectedAccount);
  assert.strictEqual(resAfter.virtualEntries[0].amount, 12000); // rolled up: (5000 + 10000) - (1000 + 2000) = 12000
  assert.strictEqual(resAfter.baseOpeningEntries.length, 0); // no line item

  // Case D: Date range is entirely before 2026-06-01 (e.g. 2026-05-01 to 2026-05-15)
  const resEntirelyBefore = getProcessedOpeningBalances("2026-05-01", "2026-05-15", selectedAccount);
  assert.strictEqual(resEntirelyBefore.virtualEntries[0].amount, 4000);
  assert.strictEqual(resEntirelyBefore.baseOpeningEntries.length, 0); // not covered by range
});

// 2. Running Balance Crossing Zero, Debit, and Credit Transitions
test("running balance transitions and crossings", () => {
  let runningBal = 1000; // starts with Debit balance of 1000

  const txs = [
    { entry_type: "credit", amount: 1500 }, // crossing to Credit: -500
    { entry_type: "credit", amount: 500 },  // deeper credit: -1000
    { entry_type: "debit", amount: 1000 },  // hits exactly zero: 0
    { entry_type: "debit", amount: 1200 },  // crossing to Debit: +1200
  ];

  const balances = [];
  txs.forEach((tx) => {
    if (tx.entry_type === "debit") {
      runningBal += tx.amount;
    } else {
      runningBal -= tx.amount;
    }
    balances.push(runningBal);
  });

  assert.strictEqual(balances[0], -500);
  assert.strictEqual(balances[1], -1000);
  assert.strictEqual(balances[2], 0);
  assert.strictEqual(balances[3], 1200);
});

// 3. Stock Availability Combinations (Fabric, Roto, Lamination)
test("stock check combinations for Lamination and Offset", () => {
  const testStockCheck = (fabricId, rotoFilmId, lamRollId, stockDb) => {
    const hasFabric = stockDb.fabric.includes(fabricId);
    const hasRoto = rotoFilmId ? stockDb.roto.includes(rotoFilmId) : true;
    const hasLam = lamRollId ? stockDb.lamination.includes(lamRollId) : true;
    return {
      lamReady: hasFabric && hasRoto,
      offsetReady: hasFabric && hasLam
    };
  };

  const dbAllInStock = { fabric: ["fab-1"], roto: ["roto-1"], lamination: ["lam-1"] };
  const dbSomeOut = { fabric: ["fab-1"], roto: [], lamination: [] };
  const dbAllOut = { fabric: [], roto: [], lamination: [] };

  // Case A: Everything in stock
  const resAllIn = testStockCheck("fab-1", "roto-1", "lam-1", dbAllInStock);
  assert.strictEqual(resAllIn.lamReady, true);
  assert.strictEqual(resAllIn.offsetReady, true);

  // Case B: Fabric in stock, but Roto Film and Lamination are out of stock
  const resSomeOut = testStockCheck("fab-1", "roto-1", "lam-1", dbSomeOut);
  assert.strictEqual(resSomeOut.lamReady, false);
  assert.strictEqual(resSomeOut.offsetReady, false);

  // Case C: Fabric out of stock, other materials in stock
  const dbFabOut = { fabric: [], roto: ["roto-1"], lamination: ["lam-1"] };
  const resFabOut = testStockCheck("fab-1", "roto-1", "lam-1", dbFabOut);
  assert.strictEqual(resFabOut.lamReady, false);
  assert.strictEqual(resFabOut.offsetReady, false);

  // Case D: Everything out of stock
  const resAllOut = testStockCheck("fab-1", "roto-1", "lam-1", dbAllOut);
  assert.strictEqual(resAllOut.lamReady, false);
  assert.strictEqual(resAllOut.offsetReady, false);
});
