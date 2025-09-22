// app/api/artist-application/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
// @ts-ignore
const fontkit = require("fontkit");

const BRAND = {
  primary: rgb(0x11/255, 0x18/255, 0x27/255), // #111827
  accent:  rgb(0x25/255, 0x63/255, 0xEB/255), // #2563EB
  light:   rgb(0xEF/255, 0xF6/255, 0xFF/255), // #EFF6FF
  border:  rgb(0xE5/255, 0xE7/255, 0xEB/255), // #E5E7EB
  muted:   rgb(0x6B/255, 0x72/255, 0x80/255), // #6B7280
  white:   rgb(1,1,1),
  zebra:   rgb(0xF9/255, 0xFA/255, 0xFB/255), // #F9FAFB
};

const MARGIN = { top: 60, bottom: 50, left: 40, right: 40 };
const A4: [number, number] = [595.28, 841.89]; // pts

const BODY = 10;
const H1 = 20;
const H2 = 12;
const LINE_H = (size: number) => size * 1.35;

function safe(v: unknown) { return (typeof v === "string" ? v : "") || ""; }

async function readPublic(relPath: string): Promise<Uint8Array> {
  const abs = path.join(process.cwd(), "public", relPath);
  return await fs.promises.readFile(abs);
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number) {
  const words = (text || "—").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width <= maxWidth) line = test;
    else { if (line) lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

type TableRow = [string, string];
function drawTwoColTable(opts: {
  page: any; x: number; y: number; w: number;
  leftRatio: number; rows: TableRow[];
  font: any; fontSize: number; rowPad: number;
}) {
  const { page, x, y, w, leftRatio, rows, font, fontSize, rowPad } = opts;
  const leftW = w * leftRatio;
  const rightW = w - leftW;
  let cy = y;

  for (let i = 0; i < rows.length; i++) {
    const [k, v] = rows[i];
    const kLines = wrapText(k || "—", leftW - rowPad*2, font, fontSize);
    const vLines = wrapText(v || "—", rightW - rowPad*2, font, fontSize);
    const lines = Math.max(kLines.length, vLines.length);
    const rowH = lines * LINE_H(fontSize) + rowPad*2;

    page.drawRectangle({
      x, y: cy, width: w, height: rowH,
      color: (i % 2 === 0) ? BRAND.white : BRAND.zebra,
      borderColor: BRAND.border, borderWidth: 0.5,
    });

    for (let li = 0; li < kLines.length; li++) {
      page.drawText(kLines[li], {
        x: x + rowPad,
        y: cy + rowH - rowPad - (li + 1) * LINE_H(fontSize),
        size: fontSize, font, color: BRAND.primary,
      });
    }
    for (let li = 0; li < vLines.length; li++) {
      page.drawText(vLines[li], {
        x: x + leftW + rowPad,
        y: cy + rowH - rowPad - (li + 1) * LINE_H(fontSize),
        size: fontSize, font, color: BRAND.primary,
      });
    }

    cy += rowH;
  }
  return cy;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const project     = safe(formData.get("project"));
    const fullName    = safe(formData.get("fullName"));
    const email       = safe(formData.get("email"));
    const phone       = safe(formData.get("phone"));
    const country     = safe(formData.get("country"));
    const city        = safe(formData.get("city"));
    const dateOfBirth = safe(formData.get("dateOfBirth"));
    const heightValue = safe(formData.get("height"));
    const weight      = safe(formData.get("weight"));
    const waist       = safe(formData.get("waist"));
    const bust        = safe(formData.get("bust"));
    const instagram   = safe(formData.get("instagram"));
    const position  = safe(formData.get("position"));
    const experience  = safe(formData.get("experience"));
    const additional  = safe(formData.get("additional"));
    const following   = safe(formData.get("following"));

    let photoBytes: Uint8Array | null = null;
    const photo = formData.get("photo") as unknown as File | null;
    if (photo && typeof (photo as any)?.arrayBuffer === "function") {
      photoBytes = new Uint8Array(await (photo as any).arrayBuffer());
    }

    let logoBytes: Uint8Array | null = null;
    try { logoBytes = await readPublic("company-logo.png"); } catch {}

    let fontRegularBytes: Uint8Array, fontBoldBytes: Uint8Array;
    try {
      fontRegularBytes = await readPublic("fonts/Roboto-Regular.ttf");
      fontBoldBytes    = await readPublic("fonts/Roboto-Bold.ttf");
    } catch {
      return NextResponse.json({ ok: false, error: "Missing fonts in /public/fonts" }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage(A4);
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(fontRegularBytes);
    const fontBold    = await pdfDoc.embedFont(fontBoldBytes);

    // Заголовок
    let cursorY = height - MARGIN.top;
    page.drawText("Artist Application", {
      x: MARGIN.left, y: cursorY, size: H1, font: fontBold, color: BRAND.primary,
    });
    cursorY -= H1 + 2;
    page.drawText(`Candidate Profile for ${project}`, {
      x: MARGIN.left, y: cursorY, size: 10, font: fontRegular, color: BRAND.muted,
    });

    // Лого
    if (logoBytes) {
      const img = await pdfDoc.embedPng(logoBytes);
      const lw = 100;
      const lh = (img.height / img.width) * lw;
      const lx = width - MARGIN.right - lw;
      const ly = height - MARGIN.top - 40;
      page.drawImage(img, { x: lx, y: ly, width: lw, height: lh });
    }

    cursorY -= 18;

    // Summary band
    const bandX = MARGIN.left;
    const bandW = width - MARGIN.left - MARGIN.right;
    const bandH = 28;
    const bandY = cursorY - bandH;
    page.drawRectangle({ x: bandX, y: bandY, width: bandW, height: bandH, color: BRAND.light });
    const bandText = `Name: ${fullName || "—"}     •     Position: ${position || "—"}     •     Instagram: ${instagram || "—"}`;
    page.drawText(bandText, { x: bandX + 10, y: bandY + 9, size: BODY, font: fontRegular, color: BRAND.primary });

    // Колонки
    const colGap = 16;
    const leftW  = (width - MARGIN.left - MARGIN.right - colGap) * 0.62;
    const rightW = (width - MARGIN.left - MARGIN.right - colGap) * 0.38;
    const leftX  = MARGIN.left;
    const rightX = leftX + leftW + colGap;

    let cursorLeftY = bandY - 20; //
    let cursorRightY = bandY - 20;

    // LEFT: Contact
    page.drawText("Contact & Basics", {
      x: leftX, y: cursorLeftY, size: H2, font: fontBold, color: BRAND.accent,
    });
    cursorLeftY -= H2 + 208;

    cursorLeftY = drawTwoColTable({
      page, x: leftX, y: cursorLeftY, w: leftW, leftRatio: 0.32,
      rows: [
        ["Email:",           email || "—"],
        ["Phone:",           phone || "—"],
        ["Nationality:",     country || "—"],
        ["Current city:",    city || "—"],
        ["Date of Birth:",   dateOfBirth || "—"],
        ["Height/Weight:", `${heightValue || "—"}${"cm"} / ${weight || "—"}${"kg"}`],
        ["Waist(cm):",           waist || "—"],
        ["Bust(cm):",            bust || "—"],
      ],
      font: fontRegular, fontSize: BODY, rowPad: 6,
    });
    cursorLeftY += 50;

    // RIGHT: Photo
    page.drawText("Photo", {
      x: rightX, y: cursorRightY, size: H2, font: fontBold, color: BRAND.accent,
    });
    cursorRightY -= H2 + 4;

    const photoW = rightW;
    const photoH = 204;
    page.drawRectangle({
      x: rightX, y: cursorRightY - photoH, width: photoW, height: photoH,
      borderColor: BRAND.border, borderWidth: 0.5,
    });

    if (photoBytes) {
      let img: any = null;
      try { img = await pdfDoc.embedJpg(photoBytes); }
      catch { img = await pdfDoc.embedPng(photoBytes); }
      const boxW = photoW - 12, boxH = photoH - 12;
      const ratio = Math.min(boxW / img.width, boxH / img.height);
      const iw = img.width * ratio, ih = img.height * ratio;
      const ix = rightX + (photoW - iw) / 2;
      const iy = (cursorRightY - photoH) + (photoH - ih) / 2;
      page.drawImage(img, { x: ix, y: iy, width: iw, height: ih });
    }
    cursorRightY -= photoH + 18;

    // ===== BOTTOM STACK =====
    let stackY = Math.min(cursorLeftY, cursorRightY) - 16;
    if (stackY < 140) stackY = 140;
    const boxMaxW = width - MARGIN.left - MARGIN.right - 12;
    // Experience (full-width)
    page.drawText("Experience", {
      x: MARGIN.left, y: stackY, size: H2, font: fontBold, color: BRAND.accent,
    });
    stackY -= H2 + 6;
    const expLines = wrapText(experience || "—", boxMaxW, fontRegular, BODY);
    const expH = expLines.length * LINE_H(BODY) + 16;
    page.drawRectangle({
      x: MARGIN.left, y: stackY - expH + 4,
      width: width - MARGIN.left - MARGIN.right, height: expH,
      borderColor: BRAND.border, borderWidth: 0.5,
    });
    let expNy = stackY - 10;
    for (const ln of expLines) {
      page.drawText(ln, { x: MARGIN.left + 6, y: expNy, size: BODY, font: fontRegular, color: BRAND.primary });
      expNy -= LINE_H(BODY);
    }
    stackY -= expH + 20;

    // Additional
    page.drawText("Additional", {
      x: MARGIN.left, y: stackY, size: H2, font: fontBold, color: BRAND.accent,
    });
    stackY -= H2 + 6;
    const additionalText = additional && additional.trim() ? additional.trim() : "—";
    const additionalLines = wrapText(additionalText, boxMaxW, fontRegular, 9);
    const additionalH = additionalLines.length * LINE_H(9) + 16;
    page.drawRectangle({
      x: MARGIN.left, y: stackY - additionalH + 4,
      width: width - MARGIN.left - MARGIN.right, height: additionalH,
      borderColor: BRAND.border, borderWidth: 0.5,
    });
    let addNy = stackY - 10;
    for (const ln of additionalLines) {
      page.drawText(ln, { x: MARGIN.left + 6, y: addNy, size: 9, font: fontRegular, color: BRAND.muted });
      addNy -= LINE_H(9);
    }
    stackY -= additionalH + 20;

    // Notes
    page.drawText("Notes", {
      x: MARGIN.left, y: stackY, size: H2, font: fontBold, color: BRAND.accent,
    });
    stackY -= H2 + 6;
    const notesText = `Submitted on ${(new Date()).toLocaleString("en-US", {
      dateStyle: "long", timeStyle: "short", timeZone: "UTC"
    })} UTC. Form generated by K-Art Company website.`;
    const notesLines = wrapText(notesText, boxMaxW, fontRegular, 9);
    const notesH = notesLines.length * LINE_H(9) + 16;
    page.drawRectangle({
      x: MARGIN.left, y: stackY - notesH + 4,
      width: width - MARGIN.left - MARGIN.right, height: notesH,
      borderColor: BRAND.border, borderWidth: 0.5,
    });
    let notesNy = stackY - 10;
    for (const ln of notesLines) {
      page.drawText(ln, { x: MARGIN.left + 6, y: notesNy, size: 9, font: fontRegular, color: BRAND.muted });
      notesNy -= LINE_H(9);
    }

    // Footer
    page.drawText(`Artist Application • ${fullName || "Candidate"} • K-Art`, {
      x: 40, y: 40, size: 8, font: fontRegular, color: BRAND.muted,
    });
    page.drawText("", { x: width - 50, y: 40, size: 8, font: fontRegular, color: BRAND.muted });

    const pdfBuffer = Buffer.from(await pdfDoc.save());

    // SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST!,
      port: Number(process.env.EMAIL_PORT || 465),
      secure: String(process.env.EMAIL_SECURE || "true") === "true",
      auth: { user: process.env.EMAIL_USER!, pass: process.env.EMAIL_PASS! },
    });

    const toCompany = "kartagency@gmail.com";
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
      to: toCompany,
      subject: `New Artist Application — ${fullName || "Candidate"}`,
      html: `<p><b>New application received.</b></p>
             <p>Candidate: ${fullName || "—"}<br/>Position: ${position || "—"}<br/>Email: ${email || "—"}</p>
             <p>Following text: ${following || "-"}</p>
             <p>PDF attached.</p>`,
      attachments: [{ filename: `${(fullName || "candidate").replace(/\s+/g, "_")}_application.pdf`, content: pdfBuffer }],
    });

    if (email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
          to: email,
          subject: "Your application has been received",
          html: `<p>Hi ${fullName || "there"}, thanks for your application! We have received your profile.</p>`,
          attachments: [{ filename: "Your_Application.pdf", content: pdfBuffer }],
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
