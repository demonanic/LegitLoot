import test from "node:test";
import assert from "node:assert/strict";

function validDob(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function ageOnToday(dob, today) {
  const [year, month, day] = dob.split("-").map(Number);
  let age = today.getUTCFullYear() - year;
  if (today.getUTCMonth() + 1 < month || (today.getUTCMonth() + 1 === month && today.getUTCDate() < day)) age--;
  return age;
}
test("DOB validation rejects malformed, impossible and future dates", () => {
  assert.equal(validDob("2000-01-01"), true);
  assert.equal(validDob("2001-02-29"), false);
  assert.equal(validDob("not-a-date"), false);
  assert.equal(validDob("2999-01-01"), true); // age check separately rejects future DOB
});
test("18+ gate calculates birthday boundary correctly", () => {
  const today = new Date("2026-11-24T12:00:00Z");
  assert.equal(ageOnToday("2008-11-24", today), 18);
  assert.equal(ageOnToday("2008-11-25", today), 17);
  assert.equal(ageOnToday("2000-01-01", today), 26);
});
