import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface GenerateCertOptions {
  studentName: string;
  courseTitle: string;
  certificateCode: string;
  completionDate: string;
  instructorName?: string;
}

export async function generateCertificatePdf({
  studentName,
  courseTitle,
  certificateCode,
  completionDate,
  instructorName = "Neeraj Kumar",
}: GenerateCertOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // Landscape A4: 841.89 x 595.28 points
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Background deep navy
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.04, 0.06, 0.12), // #0a0f1e
  });

  // Outer Gold/Blue Gradient-like Border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.96, 0.65, 0.14), // #f5a623
    borderWidth: 2,
  });

  // Inner subtle border
  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: rgb(0.12, 0.44, 1.0), // #1e6fff
    borderWidth: 1,
  });

  // Header Brand
  const brandTitle = "PROCAREERLABS";
  const brandWidth = fontBold.widthOfTextAtSize(brandTitle, 22);
  page.drawText(brandTitle, {
    x: (width - brandWidth) / 2,
    y: height - 90,
    size: 22,
    font: fontBold,
    color: rgb(0.96, 0.65, 0.14),
  });

  const subtitle = "CERTIFICATE OF EXCELLENCE & COMPLETION";
  const subWidth = fontBold.widthOfTextAtSize(subtitle, 14);
  page.drawText(subtitle, {
    x: (width - subWidth) / 2,
    y: height - 125,
    size: 14,
    font: fontBold,
    color: rgb(0.98, 0.98, 0.98),
  });

  const presentedTo = "This is proudly presented to";
  const presWidth = fontItalic.widthOfTextAtSize(presentedTo, 13);
  page.drawText(presentedTo, {
    x: (width - presWidth) / 2,
    y: height - 175,
    size: 13,
    font: fontItalic,
    color: rgb(0.58, 0.64, 0.72),
  });

  // Student Name
  const nameSize = 32;
  const nameWidth = fontBold.widthOfTextAtSize(studentName, nameSize);
  page.drawText(studentName, {
    x: (width - nameWidth) / 2,
    y: height - 230,
    size: nameSize,
    font: fontBold,
    color: rgb(0.12, 0.44, 1.0), // #1e6fff
  });

  // Divider under name
  page.drawLine({
    start: { x: (width - 400) / 2, y: height - 245 },
    end: { x: (width + 400) / 2, y: height - 245 },
    thickness: 1,
    color: rgb(0.96, 0.65, 0.14),
  });

  // Description
  const descText = `For successfully mastering and demonstrating practical competencies in`;
  const descWidth = fontRegular.widthOfTextAtSize(descText, 12);
  page.drawText(descText, {
    x: (width - descWidth) / 2,
    y: height - 280,
    size: 12,
    font: fontRegular,
    color: rgb(0.7, 0.75, 0.82),
  });

  // Course Title
  const courseSize = 20;
  const courseWidth = fontBold.widthOfTextAtSize(courseTitle, courseSize);
  page.drawText(courseTitle, {
    x: (width - courseWidth) / 2,
    y: height - 325,
    size: courseSize,
    font: fontBold,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Footer: Signatures & Verification Code
  // Left: Date
  page.drawText(`Date of Issue: ${completionDate}`, {
    x: 60,
    y: 80,
    size: 10,
    font: fontRegular,
    color: rgb(0.58, 0.64, 0.72),
  });

  // Center: Certificate Code & QR Ref
  const certIdText = `Verification Code: ${certificateCode}`;
  const certIdWidth = fontBold.widthOfTextAtSize(certIdText, 10);
  page.drawText(certIdText, {
    x: (width - certIdWidth) / 2,
    y: 80,
    size: 10,
    font: fontBold,
    color: rgb(0.96, 0.65, 0.14),
  });

  page.drawText(`Verify at: procareerlabs.com/verify`, {
    x: (width - fontRegular.widthOfTextAtSize(`Verify at: procareerlabs.com/verify`, 9)) / 2,
    y: 65,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.55),
  });

  // Right: Instructor
  const instTitle = `${instructorName}`;
  const instRole = "Lead Instructor, ProCareerLabs";
  const instWidth = fontBold.widthOfTextAtSize(instTitle, 11);
  page.drawText(instTitle, {
    x: width - 240,
    y: 85,
    size: 11,
    font: fontBold,
    color: rgb(0.98, 0.98, 0.98),
  });
  page.drawText(instRole, {
    x: width - 240,
    y: 70,
    size: 9,
    font: fontRegular,
    color: rgb(0.58, 0.64, 0.72),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
