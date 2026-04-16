// ── Keyboard mode toggle ──────────────────────────────────────
let numericMode = true; // default: numeric keyboard

function toggleKeyboard() {
  numericMode = !numericMode;
  const textarea = document.getElementById("inputValues");
  const kbToggle = document.getElementById("kbToggle");
  const kbIcon   = document.getElementById("kbIcon");
  const kbLabel  = document.getElementById("kbLabel");

  if (numericMode) {
    textarea.inputMode = "decimal";
    kbIcon.textContent  = "🔢";
    kbLabel.textContent = "Numeric";
    kbToggle.classList.remove("full-kb");
    textarea.placeholder = "Type a number, use → for next line...";
  } else {
    textarea.inputMode = "text";
    kbIcon.textContent  = "🔡";
    kbLabel.textContent = "Full KB";
    kbToggle.classList.add("full-kb");
    textarea.placeholder = "Type a number, press Enter for next line...";
  }
  textarea.focus();
}

// ── Core calculator functions ─────────────────────────────────
function applyAdjustments() {
  const input = document.getElementById("inputValues").value.trim().split("\n");
  const defaultAdjustment = parseFloat(document.getElementById("defaultAdjustment").value) || 0;
  const multiplier = parseFloat(document.getElementById("multiplierValue").value) || 1;
  const emptyMsg = document.getElementById("emptyMsg");

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  let hasValid = false;

  input.forEach((val, idx) => {
    const originalValue = parseFloat(val);
    if (isNaN(originalValue)) return;
    hasValid = true;

    const tr = document.createElement("tr");
    tr.setAttribute("data-original", originalValue);

    const indexCell = document.createElement("td");
    indexCell.textContent = idx + 1;

    const originalCell = document.createElement("td");
    originalCell.textContent = originalValue.toFixed(2);

    const adjustmentCell = document.createElement("td");
    const adjInput = document.createElement("input");
    adjInput.type = "number";
    adjInput.value = defaultAdjustment;
    adjInput.addEventListener("input", () => { updateFinal(tr); updateTotal(); });
    adjustmentCell.appendChild(adjInput);

    const final = originalValue + defaultAdjustment;
    const finalCell = document.createElement("td");
    finalCell.textContent = final.toFixed(2);

    const multipliedCell = document.createElement("td");
    multipliedCell.textContent = (final * multiplier).toFixed(2);

    tr.appendChild(indexCell);
    tr.appendChild(originalCell);
    tr.appendChild(adjustmentCell);
    tr.appendChild(finalCell);
    tr.appendChild(multipliedCell);
    tbody.appendChild(tr);
  });

  emptyMsg.style.display = hasValid ? "none" : "block";
  if (hasValid) updateTotal();
}

function updateFinal(row) {
  const original = parseFloat(row.getAttribute("data-original"));
  const adj = parseFloat(row.cells[2].firstChild.value) || 0;
  const final = original + adj;
  row.cells[3].textContent = final.toFixed(2);
  const multiplier = parseFloat(document.getElementById("multiplierValue").value) || 1;
  row.cells[4].textContent = (final * multiplier).toFixed(2);
}

function updateMultiplier() {
  const tbody = document.getElementById("tableBody");
  const multiplier = parseFloat(document.getElementById("multiplierValue").value) || 1;
  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    if (row.id === "totalRow") continue;
    const final = parseFloat(row.cells[3].textContent) || 0;
    row.cells[4].textContent = (final * multiplier).toFixed(2);
  }
  updateTotal();
}

function updateTotal() {
  const tbody = document.getElementById("tableBody");
  let originalTotal = 0, adjustmentTotal = 0, finalTotal = 0, multipliedTotal = 0;

  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    if (row.id === "totalRow") continue;
    const original   = parseFloat(row.getAttribute("data-original"));
    const adj        = parseFloat(row.cells[2]?.firstChild?.value);
    const final      = parseFloat(row.cells[3]?.textContent);
    const multiplied = parseFloat(row.cells[4]?.textContent);
    if (!isNaN(original))   originalTotal   += original;
    if (!isNaN(adj))        adjustmentTotal += adj;
    if (!isNaN(final))      finalTotal      += final;
    if (!isNaN(multiplied)) multipliedTotal += multiplied;
  }

  let totalRow = document.getElementById("totalRow");
  if (!totalRow) {
    totalRow = document.createElement("tr");
    totalRow.id = "totalRow";
    tbody.appendChild(totalRow);
  }
  totalRow.innerHTML = `
    <td>Total</td>
    <td>${originalTotal.toFixed(2)}</td>
    <td>${adjustmentTotal.toFixed(2)}</td>
    <td>${finalTotal.toFixed(2)}</td>
    <td>${multipliedTotal.toFixed(2)}</td>
  `;
}

// ── Export functions ──────────────────────────────────────────
function exportToExcel() {
  exportToCSV();
}

function toggleExportMenu(e) {
  e.stopPropagation();
  document.getElementById("exportDropdown").classList.toggle("open");
}

document.addEventListener("click", () => {
  document.getElementById("exportDropdown")?.classList.remove("open");
});

function getTableData() {
  const headers = ["#", "Weight", "Multiply", "Final", "Price"];
  const tbody   = document.getElementById("tableBody");
  const rows    = [];
  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    const cells = [];
    for (let j = 0; j < row.cells.length; j++) {
      const input = row.cells[j].querySelector("input");
      cells.push(input ? input.value : row.cells[j].textContent.trim());
    }
    rows.push(cells);
  }
  return { headers, rows };
}

function exportToCSV() {
  document.getElementById("exportDropdown")?.classList.remove("open");
  const { headers, rows } = getTableData();
  if (!rows.length) { alert("No data to export. Click Apply Adjustments first."); return; }
  const csv     = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\r\n");
  const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `weight_calculator_${dateStr}.csv`);
  link.click();
}

function exportToPDF() {
  document.getElementById("exportDropdown")?.classList.remove("open");
  const { headers, rows } = getTableData();
  if (!rows.length) { alert("No data to export. Click Apply Adjustments first."); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  doc.setFillColor(0, 123, 255);
  doc.rect(0, 0, 220, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Weight Calculator", 14, 17);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${dateStr}`, 14, 24);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 36,
    styles: { font: "helvetica", fontSize: 10, cellPadding: 5, halign: "center" },
    headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    rowPageBreak: "auto",
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Created by P.Ravi Varma", 14, doc.internal.pageSize.height - 8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 8);
  }
  doc.save(`weight_calculator_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Line numbers ──────────────────────────────────────────────
function updateLineNumbers() {
  const textarea       = document.getElementById("inputValues");
  const lineNumbers    = document.getElementById("lineNumbers");
  const lineCountBadge = document.getElementById("lineCountBadge");

  const lines      = textarea.value === "" ? [""] : textarea.value.split("\n");
  const totalLines = lines.length;
  const cursorLine = textarea.value.slice(0, textarea.selectionStart).split("\n").length;

  lineNumbers.innerHTML = "";
  for (let i = 1; i <= totalLines; i++) {
    const div = document.createElement("div");
    div.className = "line-num" + (i === cursorLine ? " active-line" : "");
    div.textContent = i;
    lineNumbers.appendChild(div);
  }

  lineNumbers.scrollTop = textarea.scrollTop;

  const validCount = lines.filter(l => l.trim() !== "" && !isNaN(parseFloat(l.trim()))).length;
  lineCountBadge.textContent = validCount === 1 ? "1 value" : validCount + " values";
}

// ── DOMContentLoaded ──────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("theme") === "dark";
  document.getElementById("themeToggle").checked = isDark;
  document.body.classList.toggle("dark", isDark);

  const textarea = document.getElementById("inputValues");

  // Insert newline helper
  function insertNewline() {
    const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, start) + "\n" + textarea.value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    setTimeout(updateLineNumbers, 0);
  }

  textarea.addEventListener("keydown", (e) => {
    if (numericMode) {
      // In numeric mode: Tab/Enter both insert newline
      if (e.key === "Enter" || e.key === "Tab" || e.keyCode === 13 || e.keyCode === 9) {
        e.preventDefault();
        insertNewline();
        return;
      }
    } else {
      // In full keyboard mode: Tab still inserts newline, Enter works naturally
      if (e.key === "Tab" || e.keyCode === 9) {
        e.preventDefault();
        insertNewline();
        return;
      }
      if (e.key === "Enter" || e.keyCode === 13) {
        // Let browser handle Enter naturally (inserts \n in textarea)
        setTimeout(updateLineNumbers, 0);
        return;
      }
    }

    const navKeys = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
    if (navKeys.includes(e.key)) {
      setTimeout(updateLineNumbers, 0);
      return;
    }
    // Block non-numeric characters
    if (!/^[\d.\-]$/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Paste: keep only valid number lines
  textarea.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasted  = (e.clipboardData || window.clipboardData).getData("text");
    const cleaned = pasted
      .split("\n")
      .map(l => l.trim())
      .filter(l => /^-?\d*\.?\d+$/.test(l))
      .join("\n");
    const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, start) + cleaned + textarea.value.slice(end);
    updateLineNumbers();
  });

  textarea.addEventListener("input",  updateLineNumbers);
  textarea.addEventListener("click",  updateLineNumbers);
  textarea.addEventListener("keyup",  updateLineNumbers);
  textarea.addEventListener("scroll", () => {
    document.getElementById("lineNumbers").scrollTop = textarea.scrollTop;
  });

  updateLineNumbers();
});
