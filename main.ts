// Make the AI Judge Laugh: the Office Joke Open — make.fun entry.
//
// The entry is one joke about office life, 102 characters, one line:
//
//   The fire alarm went off during the all-hands, and it was the only
//   meeting all year that ended on time.
//
// Why this joke, against the judge's brief (most important first):
// 1. On subject and a joke, not a complaint: an office incident — the
//    all-hands meeting — told as a gag, not a grumble about work.
// 2. The laugh is earned in the last few words: the fire alarm is the
//    setup, and "ended on time" is the payoff — the one meeting that
//    finished on schedule is the one a fire alarm cut short. The turn
//    lands on the final clause, exactly where the brief wants it.
// 3. Specific office detail: the all-hands, the meeting everyone
//    dreads, and the shared recognition that meetings never end on
//    time — not a generic complaint about being busy.
// 4. Fresh: the familiar "this meeting could have been an email"
//    setup is left alone; instead the joke takes the fire alarm —
//    the one thing that can actually end a meeting — and makes it
//    the office's only on-time finish. No reply-all, no printer,
//    no "per my last email".
// 5. Tight: every word earns its place, one pass, no explanation
//    needed. "Only" does the work — every other meeting ran over.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "The fire alarm went off during the all-hands, and it was the only meeting all year that ended on time.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–200 characters of UTF-8 text, not only
// whitespace, on a single line — and the judge's first criterion is
// that the text IS one joke about office life, so the code enforces
// the shape too: one line, inside the limit, ending with a full
// stop. Refuse to ship anything outside that: a second line would
// stop being one line, and padding past 200 characters would fail
// the gate outright.
if (line.length < 1 || line.length > 200) {
  throw new Error(`entry line is ${line.length} characters, outside the 1-200 limit`);
}
if (line.trim().length === 0 || /[\r\n]/.test(line)) {
  throw new Error("entry line must be one non-blank line");
}
// A joke is a complete sentence: it ends with a full stop, not
// a dangling clause.
if (!line.endsWith(".")) {
  throw new Error("entry line must end with a full stop");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte for
// byte, so a partial or corrupted write can never reach the judge —
// and that its byte length matches the line, so no stray newline or
// encoding surprise can slip past the character gate.
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== line.length) {
  throw new Error("entry.txt byte length does not match the entry line");
}
console.log(line);
