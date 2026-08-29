const from = "2023-01-01";
const to = "2030-01-01";
const lRolls = [{ roll_id: null }, { roll_id: "HELLO-123" }];
const rProducts = [{ id: "123", brand: "HELLO" }];
try {
  rProducts.map((p) => {
    const lamRollsMatched = lRolls.filter((lr) => (lr.roll_id || "").toUpperCase().includes((p.brand || "").toUpperCase()));
    console.log(lamRollsMatched);
  });
  console.log("No error!");
} catch (e) {
  console.error("Error:", e);
}
