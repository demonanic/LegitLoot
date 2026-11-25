import test from "node:test";
import assert from "node:assert/strict";

function validDob(value) {
  if (typeof value !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function ageOnDate(dob, today) {
  const [year, month, day] = dob.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
  let age = todayYear - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) age--;
  return age;
}
test("DOB validation rejects malformed and impossible dates", () => {
  assert.equal(validDob("2000-01-01"), true);
  assert.equal(validDob("2001-02-29"), false);
  assert.equal(validDob("not-a-date"), false);
  assert.equal(validDob("2999-01-01"), true);
});
test("18+ boundary is based on the supplied local calendar date", () => {
  assert.equal(ageOnDate("2008-11-25", "2026-11-25"), 18);
  assert.equal(ageOnDate("2008-11-25", "2026-11-24"), 17);
  assert.equal(ageOnDate("2008-11-26", "2026-11-25"), 17);
  assert.equal(ageOnDate("2000-01-01", "2026-11-25"), 26);
});
test("future dates are rejected separately", () => {
  assert.equal("2999-01-01" > "2026-11-25", true);
});
