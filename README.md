# ⚖️ Weight Calculator

A clean, mobile-friendly web app for entering weight values, applying adjustments, multiplying by a price, and exporting results — built with pure HTML, CSS, and JavaScript.

---

## ✨ Features

- **Numbered input editor** — line numbers update live as you type, just like a code editor
- **Numeric keyboard support** — toggle between numeric pad and full keyboard on mobile
- **Live calculations** — Weight × Multiply = Final, Final × Input Price = Price, all updated instantly
- **Dynamic totals** — totals row auto-updates as you edit any value
- **Export to CSV** — download results as a spreadsheet
- **Export to PDF** — download a formatted PDF report with header and page numbers
- **Dark mode** — toggle dark/light theme, preference saved across sessions
- **Input validation** — only numeric values accepted (letters and symbols are blocked)
- **Paste protection** — pasting mixed content keeps only valid number lines

---

## 📸 Preview

> Open `index.html` in any browser — no build step, no install required.

---

## 🗂️ Project Structure

```
weight-calculator/
├── index.html      # App layout and structure
├── style.css       # Styling, dark mode, responsive design
└── script.js       # All logic — calculations, export, line numbers
```

---

## 🚀 How to Use

1. **Clone or download** this repository
2. Open `index.html` in your browser
3. Enter weight values in the input box (one per line)
4. Set your **Multiply** and **Input Price** values
5. Click **Apply Adjustments** to calculate
6. Export results as **CSV** or **PDF**

---

## 📱 Mobile Usage

- Tap the **🔢 Numeric** button to use the number pad keyboard
- Tap the **🔡 Full KB** button to switch to full keyboard and use Enter to go to the next line
- The app is fully responsive and works on all screen sizes

---

## 🧮 How Calculations Work

| Column   | Formula                          |
|----------|----------------------------------|
| Weight   | Your input value                 |
| Multiply | Adjustment added to each weight  |
| Final    | Weight + Multiply                |
| Price    | Final × Input Price              |
| **Total**| Sum of all rows per column       |

---

## 🛠️ Built With

- **HTML5** — structure
- **CSS3** — styling with CSS variables for theming
- **Vanilla JavaScript** — zero dependencies for core logic
- **[jsPDF](https://github.com/parallax/jsPDF)** — PDF generation (loaded via CDN)
- **[jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** — table formatting in PDF
- **[Google Fonts](https://fonts.google.com/)** — Space Mono + DM Sans

---

## 📄 License

This project is open source and free to use.

---

**Created by P.Ravi Varma**
