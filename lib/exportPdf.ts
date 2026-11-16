import {
  compareForDisplay,
  formatDate,
  isCurrent,
  todayISO,
  type Medication,
} from "./storage";

/**
 * Builds a PDF of every medicine, in the same order as the main list,
 * and starts a download. Runs entirely in the browser.
 */
export async function exportAllToPdf(items: Medication[]) {
  // Loaded on demand so the library isn't part of every page load.
  const { jsPDF } = await import("jspdf");

  const today = todayISO();
  const sorted = [...items].sort(compareForDisplay(today));
  const currentCount = sorted.filter((m) => isCurrent(m, today)).length;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  const labelW = 36;
  const bottom = pageH - margin - 8; // leave room for the footer
  let y = margin;

  const ink = (gray: number) => doc.setTextColor(gray, gray, gray);
  const ensureSpace = (needed: number) => {
    if (y + needed > bottom) {
      doc.addPage();
      y = margin;
    }
  };

  // ----- title -----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  ink(20);
  doc.text("Medicine History", margin, y + 6);
  y += 13;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  ink(90);
  doc.text(
    clean(
      `Exported ${formatDate(today)} · ${sorted.length} ${sorted.length === 1 ? "medicine" : "medicines"} ` +
        `(${currentCount} current, ${sorted.length - currentCount} past)`,
    ),
    margin,
    y,
  );
  y += 5;
  doc.text("Order: pinned first, then current, then most recently started.", margin, y);
  y += 4;
  rule();
  y += 6;

  // ----- one block per medicine -----
  sorted.forEach((m, i) => {
    const fields: [string, string][] = [
      ["Dosage", m.dosage],
      ["How often", m.frequency],
      ["Reason / condition", m.reason],
      ["Prescribed by", m.prescriber],
      ["Started", m.startDate ? formatDate(m.startDate) : ""],
      ["Stopped", m.endDate ? formatDate(m.endDate) : "Still taking"],
      ["Notes", m.notes],
    ].filter(([, v]) => v) as [string, string][];

    // Keep the heading together with at least its first line of details.
    ensureSpace(16);

    const status = [isCurrent(m, today) ? "Current" : "Past", m.pinned ? "Pinned" : ""]
      .filter(Boolean)
      .join(" · ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink(110);
    const statusText = clean(`${status}  ·  #${m.id}`);
    const statusW = doc.getTextWidth(statusText);
    doc.text(statusText, pageW - margin, y, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    ink(20);
    const title = doc.splitTextToSize(clean(`${i + 1}. ${m.name}`), contentW - statusW - 6);
    doc.text(title, margin, y);
    y += title.length * 5.5 + 1.5;

    doc.setFontSize(10);
    for (const [label, value] of fields) {
      const lines: string[] = doc.splitTextToSize(clean(value), contentW - labelW);
      lines.forEach((line, li) => {
        ensureSpace(5);
        if (li === 0) {
          doc.setFont("helvetica", "bold");
          ink(100);
          doc.text(label, margin, y);
        }
        doc.setFont("helvetica", "normal");
        ink(30);
        doc.text(line, margin + labelW, y);
        y += 5;
      });
    }

    y += 2;
    if (i < sorted.length - 1) {
      ensureSpace(8);
      rule();
      y += 7;
    }
  });

  // ----- footer on every page -----
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    ink(130);
    doc.text("Medicine History", margin, pageH - margin + 4);
    doc.text(`Page ${p} of ${pages}`, pageW - margin, pageH - margin + 4, { align: "right" });
  }

  doc.save(`medicine-history-${today}.pdf`);

  function rule() {
    doc.setDrawColor(210, 214, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
  }
}

/**
 * The PDF's built-in font only covers Western European characters (WinAnsi).
 * Anything outside it would print as garbage, so show "?" instead.
 */
const WIN_ANSI_EXTRAS = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");
function clean(text: string) {
  return Array.from(text.replace(/\r\n?/g, "\n"))
    .map((ch) => (ch === "\n" || (ch >= " " && ch <= "ÿ") || WIN_ANSI_EXTRAS.has(ch) ? ch : "?"))
    .join("");
}
