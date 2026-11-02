import { addFollowUp, createLead, findLeadByContact } from "./admin";

/**
 * Legacy-spreadsheet import, shared by the CLI (`scripts/db-import-leads.ts`)
 * and the CRM dashboard's "Import CSV" action.
 *
 * One row per buyer: their phone or WhatsApp handle, what was said, which
 * project, who owns the lead and the date they promised to call back.
 *
 * Re-running is safe: a row whose digits (or handle) already exist in the CRM
 * is counted and left alone, so the status the consultant set is never
 * overwritten by a re-import.
 */

/** Bound the work one request can make the database do. */
export const MAX_IMPORT_ROWS = 3000;

export type LeadImportResult = {
  created: number;
  /** Rows already in the CRM, matched on phone digits or handle. */
  existing: number;
  /** Rows with neither a name nor a contact. */
  skipped: number;
  /** Ids written by this run, so an import can be reversed exactly. */
  leadIds: number[];
  /** Per-row failures; the import continues past them. */
  errors: string[];
};

const HEADER = {
  name: "اسم العميل",
  phone: "الرقم",
  details: "التفاصيل",
  project: "المشروع",
  source: "المصدر",
  followUp: "تاريخ المتابعة",
  consultant: "اسم السيلز",
} as const;

const PROJECT_NAMES: Record<string, string> = {
  "sodic east": "SODIC East",
  "sodic eastvale": "EastVale",
  eastvale: "EastVale",
  "the lakes": "The Lakes",
  lakes: "The Lakes",
};

/** What the note tells us about where the lead really stands. */
const NOTE_RULES: { test: RegExp; status: string; temperature: string }[] = [
  { test: /اشترى|اشتريت|حجز في|تم الشراء/, status: "lost", temperature: "cold" },
  { test: /ميتينج|يكلمني|هكلمه النهاردة|جاهز/, status: "contacted", temperature: "hot" },
  { test: /عايز|عايزة|بادجيت|بدجيت|بيدور/, status: "qualified", temperature: "warm" },
  { test: /لم ترد|لم يرد|مقفول|مغلق|غير متاح|رنيت/, status: "contacted", temperature: "warm" },
  { test: /مش عايز|مش عايزة|مش فاهم|طلبة|طالب في|متابع مع/, status: "nurture", temperature: "cold" },
];

const BEDROOM_WORDS: [RegExp, number][] = [
  [/غرفتين|اتنين/, 2],
  [/٣ غرف|تلات غرف|3 غرف/, 3],
  [/أربع غرف|4 غرف/, 4],
];

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((value) => value.trim().length));
}

/** Digits when there are any; otherwise the handle, lowercased, as the key. */
function contactKey(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 8) return digits;
  const handle = raw.trim().replace(/^@+/, "");
  return handle ? `@${handle.toLowerCase()}` : "";
}

function toIsoDate(value: string): string | null {
  const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function classify(note: string): { status: string; temperature: string | null } {
  for (const rule of NOTE_RULES) {
    if (rule.test.test(note)) return { status: rule.status, temperature: rule.temperature };
  }
  // A row with no note is a name on a list: keep it in the queue, unrated.
  return { status: note ? "contacted" : "nurture", temperature: note ? "warm" : null };
}

function bedroomsFrom(note: string): number | null {
  for (const [test, count] of BEDROOM_WORDS) if (test.test(note)) return count;
  return null;
}

/** Import every row of a legacy spreadsheet into the CRM. */
export async function importLeadsFromCsv(csv: string): Promise<LeadImportResult> {
  const rows = parseCsv(csv.replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error("the file has a header but no data rows");

  const header = rows[0].map((h) => h.trim());
  const index = (key: string) => header.indexOf(key);

  for (const [label, key] of Object.entries(HEADER)) {
    if (index(key) === -1) throw new Error(`column "${key}" (${label}) not found in the header row`);
  }

  const data = rows.slice(1);
  if (data.length > MAX_IMPORT_ROWS) {
    throw new Error(`${data.length} rows is over the ${MAX_IMPORT_ROWS}-row limit`);
  }

  const result: LeadImportResult = { created: 0, existing: 0, skipped: 0, leadIds: [], errors: [] };

  for (const [offset, row] of data.entries()) {
    const lineNumber = offset + 2;
    try {
      const rawName = (row[index(HEADER.name)] ?? "").trim();
      const rawContact = (row[index(HEADER.phone)] ?? "").trim();
      const details = (row[index(HEADER.details)] ?? "").trim();
      const projectRaw = (row[index(HEADER.project)] ?? "").trim();
      const followUpOn = toIsoDate(row[index(HEADER.followUp)] ?? "");
      const consultant = (row[index(HEADER.consultant)] ?? "").trim();

      const key = contactKey(rawContact);
      const handle = rawContact.startsWith("@");
      if (!key && !rawName) {
        result.skipped++;
        continue;
      }

      const project = PROJECT_NAMES[projectRaw.toLowerCase()] ?? (projectRaw || null);
      const { status, temperature } = classify(details);
      const fullName = rawName || (handle ? rawContact : `Lead ${key.slice(-5)}`);
      const phone = rawContact || fullName;

      if (key && (await findLeadByContact(key))) {
        result.existing++;
        continue;
      }

      const id = await createLead({
        full_name: fullName,
        phone,
        source: "legacy",
        project,
        bedrooms: bedroomsFrom(details),
        temperature,
        message: details || null,
        status,
        assigned_to: consultant || null,
        consent: false,
        next_follow_up_on: followUpOn,
      });

      // The follow-up date on the sheet becomes the first entry of the log, so
      // the lead arrives with its history rather than as a blank row.
      await addFollowUp({
        lead_id: id,
        author: consultant || "import",
        channel: handle ? "whatsapp" : "call",
        outcome: status === "lost" ? "not_interested" : status === "contacted" ? "no_answer" : "reached",
        note: details || "Imported from the legacy list with no note.",
        logged_at: followUpOn ? new Date(`${followUpOn}T09:00:00`) : undefined,
        follow_up_on: followUpOn,
      });

      result.created++;
      result.leadIds.push(id);
    } catch (err) {
      result.errors.push(`row ${lineNumber}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return result;
}
