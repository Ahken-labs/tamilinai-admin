export type InvoiceData = {
  id: string;
  paymentMethod: string;
  planKey: string;
  planLabel: string;
  months: number;
  amountCents: number;
  discountCents: number;
  currency: string;
  promoCode: string | null;
  status: string;
  statusDisplay?: string;
  statusSuffix?: string;
  createdAt: string;
  reviewedAt?: string | null;
  adminNote?: string | null;
  userName: string | null;
  userDisplayId: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userGender?: string | null;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

const INAI_SVG = `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4.30469" y="4" width="36" height="36" rx="18" fill="#BA0453"/><path d="M31.6435 14.6338C31.286 13.7887 30.7745 13.0297 30.1231 12.3783C29.4717 11.7271 28.7129 11.2155 27.8676 10.858C26.9921 10.4876 26.0625 10.2998 25.105 10.2998C24.1474 10.2998 23.2179 10.4876 22.3422 10.858C21.4971 11.2155 20.7383 11.7271 20.0869 12.3783C19.4355 13.0297 18.9239 13.7887 18.5665 14.6338C18.196 15.5095 18.0082 16.4388 18.0082 17.3966V17.7065H17.6983C16.7408 17.7065 15.8112 17.8943 14.9356 18.2645C14.0904 18.622 13.3316 19.1337 12.6802 19.785C12.0288 20.4364 11.5173 21.1953 11.1598 22.0405C10.7894 22.9161 10.6016 23.8455 10.6016 24.803C10.6016 25.7606 10.7894 26.6901 11.1598 27.5658C11.5173 28.4109 12.0288 29.1699 12.6802 29.8213C13.3316 30.4726 14.0904 30.9841 14.9356 31.3416C15.8112 31.712 16.7408 31.8998 17.6983 31.8998H30.3791C31.2586 31.8998 31.9944 31.2739 32.1646 30.4442C32.1707 30.4146 32.1759 30.3848 32.1806 30.3546C32.1852 30.3244 32.189 30.2941 32.1922 30.2634C32.1985 30.2023 32.2016 30.1402 32.2016 30.0774V17.3966C32.2016 16.4388 32.0138 15.5095 31.6435 14.6338ZM17.6983 29.6913C15.0029 29.6913 12.81 27.4985 12.81 24.803C12.81 22.1076 15.0029 19.9149 17.6983 19.9149H18.0082V27.2812C18.0082 27.91 18.1366 28.5201 18.39 29.0947C18.4813 29.3019 18.5873 29.501 18.7076 29.6913H17.6983ZM25.4154 27.2812C25.4154 28.6103 24.2677 29.6913 22.8568 29.6913H22.7753C21.3646 29.6913 20.2167 28.5435 20.2167 27.1327V19.9149H25.4154V27.2812ZM29.9931 29.6913H26.9247C27.0449 29.501 27.151 29.3019 27.2424 29.0947C27.4955 28.5201 27.6239 27.91 27.6239 27.2812V19.922C28.9467 20.0193 29.9931 21.1264 29.9931 22.4736V29.6913ZM29.9931 18.4495C29.2878 17.999 28.4757 17.7435 27.6239 17.7104V17.356C27.6239 16.9886 27.5663 16.6259 27.4528 16.278L27.4467 16.2799C27.1257 15.2933 26.1972 14.5781 25.105 14.5781C23.7474 14.5781 22.643 15.6826 22.643 17.0402C22.643 17.2711 22.6749 17.4944 22.7347 17.7065H20.2167V17.3966C20.2167 14.7011 22.4096 12.5083 25.105 12.5083C27.8004 12.5083 29.9931 14.7011 29.9931 17.3966V18.4495Z" fill="white"/></svg>`;

function svgToPngDataUrl(svgString: string, size = 44): Promise<string> {
  return new Promise((resolve) => {
    const scale = 4;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const canvas    = document.createElement("canvas");
      canvas.width    = size * scale;
      canvas.height   = size * scale;
      const ctx       = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
    img.src = url;
  });
}

// Renders Tamil+Latin text via canvas (jsPDF built-in fonts don't support Tamil Unicode)
function renderBrandText(text: string, sizePx: number, color: string): { dataUrl: string; widthMm: number; heightMm: number } {
  const scale = 4;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const fs = sizePx * scale;
  const fontStr = `bold ${fs}px "Noto Sans Tamil", "Latha", "Tamil Sangam MN", "Nirmala UI", Arial, sans-serif`;
  ctx.font = fontStr;
  const metrics = ctx.measureText(text);
  // Use actual glyph bounds to eliminate whitespace around Tamil glyphs
  const ascent  = metrics.actualBoundingBoxAscent  ?? fs * 0.85;
  const descent = metrics.actualBoundingBoxDescent ?? fs * 0.15;
  const leftBearing = metrics.actualBoundingBoxLeft ?? 0;
  const w = Math.ceil(metrics.actualBoundingBoxRight + Math.abs(leftBearing)) + scale * 2;
  const h = Math.ceil(ascent + descent) + scale * 2;
  canvas.width  = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  ctx.font = fontStr;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  // Draw from just after left bearing so no leading gap
  ctx.fillText(text, Math.abs(leftBearing) + scale, ascent + scale);
  const widthMm  = (w / scale) * 0.26458;
  const heightMm = (h / scale) * 0.26458;
  return { dataUrl: canvas.toDataURL("image/png"), widthMm, heightMm };
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Date + 12-hour time with AM/PM
function fmtDT(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB",  { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US",  { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date}  ${time}`;
}

function fmtAmt(cents: number, currency: string): string {
  const sym = currency.toLowerCase() === "lkr" ? "Rs" : "£";
  const amt = cents / 100;
  return `${sym} ${currency.toLowerCase() === "lkr" ? Math.round(amt).toLocaleString("en-LK") : amt.toFixed(2)}`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const M   = 20;
  const PW  = 210;
  const W   = PW - M * 2;
  const net = data.amountCents - data.discountCents;

  type RGB = [number, number, number];
  const RED:  RGB = [179, 27, 56];
  const DARK: RGB = [34, 34, 34];
  const SUB:  RGB = [101, 101, 101];
  const RULE: RGB = [210, 210, 210];

  const shortId = data.id.slice(0, 8).toUpperCase();

  // Prepare assets
  const logoDataUrl = await svgToPngDataUrl(INAI_SVG, 44);
  const brand = renderBrandText("இணை.lk", 20, "#B31B38");

  // ── helpers ────────────────────────────────────────────────────────────────
  const bold   = (sz: number, c: RGB = DARK) => { doc.setFont("helvetica", "bold");   doc.setFontSize(sz); doc.setTextColor(...c); };
  const normal = (sz: number, c: RGB = DARK) => { doc.setFont("helvetica", "normal"); doc.setFontSize(sz); doc.setTextColor(...c); };
  const hRule  = (yy: number, color: RGB = RULE, lw = 0.4) => {
    doc.setDrawColor(...color); doc.setLineWidth(lw); doc.line(M, yy, M + W, yy);
  };

  // ── 1. Header: Logo + brand + contacts (left)  /  INVOICE (right) ──────────
  const LOGO_Y = 12;
  const LOGO_S = 14;                     // logo is 14mm square
  const BX     = M + 18;                 // brand column left

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", M, LOGO_Y, LOGO_S, LOGO_S);
    doc.link(M, LOGO_Y, LOGO_S, LOGO_S, { url: "https://inai.lk/" });
  }

  // Brand name as canvas image — vertically centred inside logo area
  const BRAND_H = 7;                     // fixed image height in mm
  const BRAND_W = brand.widthMm > 0
    ? (brand.widthMm / brand.heightMm) * BRAND_H
    : 28;
  const BRAND_Y = LOGO_Y + (LOGO_S - BRAND_H) / 2;   // centred: (14-7)/2 = 3.5 → y=15.5
  if (brand.dataUrl) {
    doc.addImage(brand.dataUrl, "PNG", BX, BRAND_Y, BRAND_W, BRAND_H);
    // no link on text — only the logo icon is clickable
  }

  // Subtitle starts just below logo bottom (y=26), matching old "Inai.lk" layout
  const BELOW_LOGO = LOGO_Y + LOGO_S + 2;   // 28mm
  normal(8.5, SUB);
  doc.text("Tamil Matrimony  ·  by Ahkennexus (Pvt) Ltd", BX, BELOW_LOGO);

  // Contact lines
  normal(8.5, SUB);
  doc.text("Email       :  support@inai.lk",   BX, BELOW_LOGO + 6);
  doc.text("WhatsApp :  +94 77 075 0760",       BX, BELOW_LOGO + 11.5);
  doc.text("Website    :  https://inai.lk/",    BX, BELOW_LOGO + 17);

  // INVOICE — right column, baseline centred to logo area
  bold(17, DARK);
  doc.text("INVOICE", M + W, LOGO_Y + 6, { align: "right" });   // baseline ~18mm

  normal(8.5, SUB);
  doc.text(`Ref:  #${shortId}`,                     M + W, BELOW_LOGO,        { align: "right" });
  doc.text(`Date:  ${fmtDT(data.createdAt)}`,        M + W, BELOW_LOGO + 6,   { align: "right" });
  if (data.reviewedAt) {
    doc.text(`Reviewed:  ${fmtDT(data.reviewedAt)}`, M + W, BELOW_LOGO + 11.5, { align: "right" });
  }

  // Red separator — below tallest column
  doc.setDrawColor(...RED);
  doc.setLineWidth(0.7);
  doc.line(M, BELOW_LOGO + 22, M + W, BELOW_LOGO + 22);

  // ── 2. Bill To / Invoice Details ───────────────────────────────────────────
  let lY = 59;
  let rY = 59;
  const midX = M + W / 2 + 5;

  bold(7.5, SUB);
  doc.text("BILL TO", M, lY);
  lY += 6;

  bold(12, DARK);
  doc.text(data.userName ?? "—", M, lY);
  lY += 6.5;

  normal(9, SUB);
  const userRows: [string, string | null | undefined][] = [
    ["Inai ID    ", data.userDisplayId],
    ["Email      ", data.userEmail],
    ["Phone     ", data.userPhone],
    ["Gender   ", data.userGender ? data.userGender.charAt(0).toUpperCase() + data.userGender.slice(1) : null],
  ];
  userRows.forEach(([lbl, val]) => {
    if (!val) return;
    normal(8.5, SUB);
    doc.text(`${lbl}:  `, M, lY);
    normal(8.5, DARK);
    doc.text(val, M + 22, lY);
    lY += 5.5;
  });

  bold(7.5, SUB);
  doc.text("INVOICE DETAILS", M + W, rY, { align: "right" });
  rY += 6;

  const statusColor: RGB =
    ["approved", "paid"].includes(data.status)                  ? [46, 125, 50] :
    ["rejected", "failed", "cancelled"].includes(data.status)   ? RED           :
    [200, 100, 0];

  const statusText =
    (data.statusDisplay ?? (data.status.charAt(0).toUpperCase() + data.status.slice(1))) +
    (data.statusSuffix ? `  ${data.statusSuffix}` : "");

  const detRows: Array<{ lbl: string; val: string; color?: RGB }> = [
    { lbl: "Invoice #",    val: shortId },
    { lbl: "Invoice Date", val: fmtDate(data.createdAt) },
    { lbl: "Payment",      val: data.paymentMethod },
    { lbl: "Status",       val: statusText, color: statusColor },
  ];

  detRows.forEach(({ lbl, val, color }) => {
    normal(8.5, SUB);
    doc.text(lbl, midX, rY);
    bold(8.5, color ?? DARK);
    doc.text(val, M + W, rY, { align: "right" });
    rY += 5.8;
  });

  let y = Math.max(lY, rY) + 6;
  hRule(y, [220, 220, 220], 0.5);
  y += 9;

  // ── 3. Items table ─────────────────────────────────────────────────────────
  const AMT_W  = 46;
  const divX   = M + W - AMT_W;
  const CELL_P = 5;
  const HDR_H  = 9;
  const PLAN_H = 16;
  const DISC_H = data.discountCents > 0 ? 10 : 0;
  const TOT_H  = 13;
  const tableH = HDR_H + PLAN_H + DISC_H + TOT_H;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(M, y, W, tableH, "D");

  doc.setLineWidth(0.4);
  doc.line(divX, y, divX, y + tableH);

  doc.setFillColor(243, 243, 243);
  doc.rect(M + 0.5, y + 0.5, W - 1, HDR_H - 0.5, "F");

  bold(8, [100, 100, 100]);
  doc.text("DESCRIPTION", M + CELL_P,     y + 6);
  doc.text("AMOUNT",      M + W - CELL_P, y + 6, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(M, y + HDR_H, M + W, y + HDR_H);
  y += HDR_H;

  bold(10.5, DARK);
  doc.text(data.planLabel, M + CELL_P, y + 6.5);
  normal(8.5, SUB);
  doc.text(`${data.months} month${data.months !== 1 ? "s" : ""}  ·  ${data.paymentMethod}`, M + CELL_P, y + 12);
  normal(10.5, DARK);
  doc.text(fmtAmt(data.amountCents, data.currency), M + W - CELL_P, y + 8, { align: "right" });

  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.35);
  doc.line(M, y + PLAN_H, M + W, y + PLAN_H);
  y += PLAN_H;

  if (data.discountCents > 0) {
    const discLabel = data.promoCode
      ? `Promo code discount - ${data.promoCode}`
      : "Promo code discount";
    normal(9.5, [46, 125, 50]);
    doc.text(discLabel, M + CELL_P, y + 6.5);
    doc.text(`- ${fmtAmt(data.discountCents, data.currency)}`, M + W - CELL_P, y + 6.5, { align: "right" });

    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.35);
    doc.line(M, y + DISC_H, M + W, y + DISC_H);
    y += DISC_H;
  }

  doc.setFillColor(253, 250, 251);
  doc.rect(M + 0.5, y + 0.5, W - 1, TOT_H - 0.5, "F");
  bold(11, DARK);
  doc.text("TOTAL AMOUNT DUE", M + CELL_P, y + 8.5);
  bold(12, RED);
  doc.text(fmtAmt(net, data.currency), M + W - CELL_P, y + 8.5, { align: "right" });
  y += TOT_H + 10;

  // ── 4. Payment + status lines ──────────────────────────────────────────────
  normal(9, SUB);
  doc.text("Payment method:", M, y);
  bold(9, DARK);
  doc.text(data.paymentMethod, M + 36, y);

  y += 6;
  normal(9, SUB);
  doc.text("Order status:", M, y);
  bold(9, statusColor);
  doc.text(statusText, M + 36, y);
  y += 10;

  // ── 5. Admin note ──────────────────────────────────────────────────────────
  if (data.adminNote) {
    hRule(y, [220, 220, 220]);
    y += 6;
    bold(7.5, [150, 110, 0]);
    doc.text("NOTE", M, y);
    y += 5;
    normal(9, [60, 60, 60]);
    const noteLines = doc.splitTextToSize(data.adminNote, W);
    doc.text(noteLines, M, y);
    y += (noteLines as string[]).length * 5 + 4;
  }

  // ── 6. Footer ──────────────────────────────────────────────────────────────
  const footerY = 268;
  hRule(footerY, [200, 200, 200], 0.5);

  bold(8.5, RED);
  doc.text("Inai.lk", M, footerY + 7);
  normal(8, SUB);
  doc.text("Tamil Matrimony  ·  by Ahkennexus (Pvt) Ltd", M, footerY + 13);
  doc.text("support@inai.lk  ·  WhatsApp +94 77 075 0760  ·  inai.lk", M, footerY + 18.5);

  normal(7.5, [160, 160, 160]);
  doc.text(`Generated  ${fmtDT(new Date().toISOString())}`, M + W, footerY + 7,    { align: "right" });
  doc.text("Admin-generated document",                       M + W, footerY + 13,  { align: "right" });

  const filename = `${data.userDisplayId ?? shortId}-invoice-${new Date(data.createdAt).toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ─── Business Boost Invoice ───────────────────────────────────────────────────

export type BoostInvoiceData = {
  id: string;
  businessName: string | null;
  username: string | null;
  phone: string | null;
  countryCode: string | null;
  amountLkr: number;
  discountLkr: number;
  promoCode: string | null;
  status: string;
  createdAt: string;
  reviewedAt?: string | null;
  adminNote?: string | null;
};

export async function generateBoostInvoicePDF(data: BoostInvoiceData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const M   = 20;
  const PW  = 210;
  const W   = PW - M * 2;
  const net = data.amountLkr - data.discountLkr;

  type RGB = [number, number, number];
  const RED:  RGB = [179, 27, 56];
  const DARK: RGB = [34, 34, 34];
  const SUB:  RGB = [101, 101, 101];
  const RULE: RGB = [210, 210, 210];

  const shortId = data.id.slice(0, 8).toUpperCase();

  const logoDataUrl = await svgToPngDataUrl(INAI_SVG, 44);
  const brand = renderBrandText("இணை.lk", 20, "#B31B38");

  const bold   = (sz: number, c: RGB = DARK) => { doc.setFont("helvetica", "bold");   doc.setFontSize(sz); doc.setTextColor(...c); };
  const normal = (sz: number, c: RGB = DARK) => { doc.setFont("helvetica", "normal"); doc.setFontSize(sz); doc.setTextColor(...c); };
  const hRule  = (yy: number, color: RGB = RULE, lw = 0.4) => {
    doc.setDrawColor(...color); doc.setLineWidth(lw); doc.line(M, yy, M + W, yy);
  };

  const LOGO_Y = 12;
  const LOGO_S = 14;
  const BX     = M + 18;

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", M, LOGO_Y, LOGO_S, LOGO_S);
    doc.link(M, LOGO_Y, LOGO_S, LOGO_S, { url: "https://inai.lk/" });
  }

  const BRAND_H = 7;
  const BRAND_W = brand.widthMm > 0 ? (brand.widthMm / brand.heightMm) * BRAND_H : 28;
  const BRAND_Y = LOGO_Y + (LOGO_S - BRAND_H) / 2;
  if (brand.dataUrl) doc.addImage(brand.dataUrl, "PNG", BX, BRAND_Y, BRAND_W, BRAND_H);

  const BELOW_LOGO = LOGO_Y + LOGO_S + 2;
  normal(8.5, SUB);
  doc.text("Inai Business  ·  by Ahkennexus (Pvt) Ltd", BX, BELOW_LOGO);
  doc.text("Email       :  support@inai.lk",             BX, BELOW_LOGO + 6);
  doc.text("WhatsApp :  +94 77 075 0760",                BX, BELOW_LOGO + 11.5);
  doc.text("Website    :  https://inai.lk/",             BX, BELOW_LOGO + 17);

  bold(17, DARK);
  doc.text("INVOICE", M + W, LOGO_Y + 6, { align: "right" });
  normal(8.5, SUB);
  doc.text(`Ref:  #${shortId}`,                     M + W, BELOW_LOGO,        { align: "right" });
  doc.text(`Date:  ${fmtDT(data.createdAt)}`,        M + W, BELOW_LOGO + 6,   { align: "right" });
  if (data.reviewedAt) {
    doc.text(`Reviewed:  ${fmtDT(data.reviewedAt)}`, M + W, BELOW_LOGO + 11.5, { align: "right" });
  }

  doc.setDrawColor(...RED);
  doc.setLineWidth(0.7);
  doc.line(M, BELOW_LOGO + 22, M + W, BELOW_LOGO + 22);

  let lY = 59;
  let rY = 59;
  const midX = M + W / 2 + 5;

  bold(7.5, SUB);
  doc.text("BILL TO", M, lY);
  lY += 6;

  bold(12, DARK);
  doc.text(data.businessName ?? "—", M, lY);
  lY += 6.5;

  normal(9, SUB);
  const bizRows: [string, string | null | undefined][] = [
    ["Username", data.username ? `@${data.username}` : null],
    ["Phone    ", data.phone ?? null],
  ];
  bizRows.forEach(([lbl, val]) => {
    if (!val) return;
    normal(8.5, SUB);
    doc.text(`${lbl}:  `, M, lY);
    normal(8.5, DARK);
    doc.text(val, M + 22, lY);
    lY += 5.5;
  });

  bold(7.5, SUB);
  doc.text("INVOICE DETAILS", M + W, rY, { align: "right" });
  rY += 6;

  const statusColor: RGB =
    data.status === "approved" ? [46, 125, 50] :
    data.status === "rejected" ? RED :
    [200, 100, 0];

  const statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1);

  const detRows: Array<{ lbl: string; val: string; color?: RGB }> = [
    { lbl: "Invoice #",    val: shortId },
    { lbl: "Invoice Date", val: fmtDate(data.createdAt) },
    { lbl: "Payment",      val: "Bank Transfer" },
    { lbl: "Status",       val: statusText, color: statusColor },
  ];

  detRows.forEach(({ lbl, val, color }) => {
    normal(8.5, SUB);
    doc.text(lbl, midX, rY);
    bold(8.5, color ?? DARK);
    doc.text(val, M + W, rY, { align: "right" });
    rY += 5.8;
  });

  let y = Math.max(lY, rY) + 6;
  hRule(y, [220, 220, 220], 0.5);
  y += 9;

  const AMT_W  = 46;
  const divX   = M + W - AMT_W;
  const CELL_P = 5;
  const HDR_H  = 9;
  const PLAN_H = 16;
  const DISC_H = data.discountLkr > 0 ? 10 : 0;
  const TOT_H  = 13;
  const tableH = HDR_H + PLAN_H + DISC_H + TOT_H;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(M, y, W, tableH, "D");
  doc.setLineWidth(0.4);
  doc.line(divX, y, divX, y + tableH);

  doc.setFillColor(243, 243, 243);
  doc.rect(M + 0.5, y + 0.5, W - 1, HDR_H - 0.5, "F");
  bold(8, [100, 100, 100]);
  doc.text("DESCRIPTION", M + CELL_P,     y + 6);
  doc.text("AMOUNT",      M + W - CELL_P, y + 6, { align: "right" });
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(M, y + HDR_H, M + W, y + HDR_H);
  y += HDR_H;

  bold(10.5, DARK);
  doc.text("Business Boost", M + CELL_P, y + 6.5);
  normal(8.5, SUB);
  doc.text("1 month  ·  Bank Transfer", M + CELL_P, y + 12);
  normal(10.5, DARK);
  doc.text(`Rs ${Math.round(data.amountLkr).toLocaleString("en-LK")}`, M + W - CELL_P, y + 8, { align: "right" });

  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.35);
  doc.line(M, y + PLAN_H, M + W, y + PLAN_H);
  y += PLAN_H;

  if (data.discountLkr > 0) {
    const discLabel = data.promoCode ? `Promo code discount - ${data.promoCode}` : "Discount";
    normal(9.5, [46, 125, 50]);
    doc.text(discLabel, M + CELL_P, y + 6.5);
    doc.text(`- Rs ${Math.round(data.discountLkr).toLocaleString("en-LK")}`, M + W - CELL_P, y + 6.5, { align: "right" });
    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.35);
    doc.line(M, y + DISC_H, M + W, y + DISC_H);
    y += DISC_H;
  }

  doc.setFillColor(253, 250, 251);
  doc.rect(M + 0.5, y + 0.5, W - 1, TOT_H - 0.5, "F");
  bold(11, DARK);
  doc.text("TOTAL AMOUNT DUE", M + CELL_P, y + 8.5);
  bold(12, RED);
  doc.text(`Rs ${Math.round(net).toLocaleString("en-LK")}`, M + W - CELL_P, y + 8.5, { align: "right" });
  y += TOT_H + 10;

  normal(9, SUB);
  doc.text("Payment method:", M, y);
  bold(9, DARK);
  doc.text("Bank Transfer", M + 36, y);
  y += 6;
  normal(9, SUB);
  doc.text("Order status:", M, y);
  bold(9, statusColor);
  doc.text(statusText, M + 36, y);
  y += 10;

  if (data.adminNote) {
    hRule(y, [220, 220, 220]);
    y += 6;
    bold(7.5, [150, 110, 0]);
    doc.text("NOTE", M, y);
    y += 5;
    normal(9, [60, 60, 60]);
    const noteLines = doc.splitTextToSize(data.adminNote, W);
    doc.text(noteLines, M, y);
  }

  const footerY = 268;
  hRule(footerY, [200, 200, 200], 0.5);
  bold(8.5, RED);
  doc.text("Inai Business", M, footerY + 7);
  normal(8, SUB);
  doc.text("by Ahkennexus (Pvt) Ltd", M, footerY + 13);
  doc.text("support@inai.lk  ·  WhatsApp +94 77 075 0760  ·  inai.lk", M, footerY + 18.5);
  normal(7.5, [160, 160, 160]);
  doc.text(`Generated  ${fmtDT(new Date().toISOString())}`, M + W, footerY + 7,   { align: "right" });
  doc.text("Admin-generated document",                       M + W, footerY + 13, { align: "right" });

  const filename = `${data.username ?? shortId}-boost-invoice-${new Date(data.createdAt).toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
