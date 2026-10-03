import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // A4 size: 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Colors
  const primaryColor = rgb(0.12, 0.53, 0.71); // #1E88B5 (Cyan/Blue from original CV)
  const darkTextColor = rgb(0.12, 0.14, 0.18);
  const mutedTextColor = rgb(0.35, 0.38, 0.45);
  const lightBgColor = rgb(0.96, 0.98, 0.99);
  const borderColor = rgb(0.85, 0.88, 0.92);

  // ==================== PAGE 1 ====================
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);

  // Left sidebar background
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: 215,
    height: pageHeight,
    color: lightBgColor,
  });

  // Vertical divider line
  page1.drawLine({
    start: { x: 215, y: 0 },
    end: { x: 215, y: pageHeight },
    thickness: 1,
    color: borderColor,
  });

  // --- Left Sidebar Content ---
  // Name
  page1.drawText('MD ASHRAFUL', {
    x: 25,
    y: 690,
    size: 16,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawText('ISLAM', {
    x: 25,
    y: 672,
    size: 16,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawText('Senior Graphic Designer', {
    x: 25,
    y: 655,
    size: 10,
    font: fontBold,
    color: darkTextColor,
  });

  // Contact Info
  let leftY = 625;
  const contactLines = [
    { label: 'Phone', value: '+880 1577 564 797' },
    { label: 'Email', value: 'milonpabna92@gmail.com' },
    { label: 'Facebook', value: 'ashrafulislam0709' },
    { label: 'Behance', value: 'ashraful0709' },
    { label: 'Address', value: 'Banglabazar, Lanchghat,' },
    { label: '', value: 'Pabna Sadar, Pabna.' },
  ];

  for (const c of contactLines) {
    if (c.label) {
      page1.drawText(c.label + ':', { x: 25, y: leftY, size: 8, font: fontBold, color: primaryColor });
      page1.drawText(c.value, { x: 75, y: leftY, size: 8, font: fontRegular, color: darkTextColor });
    } else {
      page1.drawText(c.value, { x: 75, y: leftY, size: 8, font: fontRegular, color: darkTextColor });
    }
    leftY -= 15;
  }

  // Career Objective
  leftY -= 10;
  page1.drawText('Career Objective', {
    x: 25,
    y: leftY,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });
  leftY -= 16;

  const objectiveText = [
    'A passionate and results-driven Graphic',
    'Designer with experience in creating',
    'visually appealing designs for digital and',
    'print media. Skilled in developing',
    'creative concepts, maintaining brand',
    'identity, and delivering high-quality',
    'design solutions while continuously',
    'improving my skills in a professional',
    'environment.'
  ];
  for (const line of objectiveText) {
    page1.drawText(line, { x: 25, y: leftY, size: 8, font: fontRegular, color: mutedTextColor });
    leftY -= 12;
  }

  // Languages
  leftY -= 15;
  page1.drawText('Languages', {
    x: 25,
    y: leftY,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });
  leftY -= 16;
  page1.drawText('• Bangla (Native)', { x: 25, y: leftY, size: 8.5, font: fontRegular, color: darkTextColor });
  leftY -= 13;
  page1.drawText('• English (Proficient)', { x: 25, y: leftY, size: 8.5, font: fontRegular, color: darkTextColor });
  leftY -= 13;
  page1.drawText('• Hindi (Conversational)', { x: 25, y: leftY, size: 8.5, font: fontRegular, color: darkTextColor });

  // Hobbies
  leftY -= 20;
  page1.drawText("HOBBY'S", {
    x: 25,
    y: leftY,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });
  leftY -= 16;
  const hobbies = ['• Traveling', '• Design', '• Photography', "• Movie's", '• Cooking', '• Flute Playing'];
  for (const h of hobbies) {
    page1.drawText(h, { x: 25, y: leftY, size: 8.5, font: fontRegular, color: darkTextColor });
    leftY -= 13;
  }

  // --- Right Main Area of Page 1 ---
  let rightY = 790;
  const rightX = 240;

  // Work Experience
  page1.drawText('WORK EXPERIENCE', {
    x: rightX,
    y: rightY,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawLine({
    start: { x: rightX, y: rightY - 5 },
    end: { x: 550, y: rightY - 5 },
    thickness: 1,
    color: primaryColor,
  });
  rightY -= 25;

  // Experience 1: Senior Graphic Designer (AR Digital Sign)
  page1.drawText('Senior Graphic Designer', { x: rightX, y: rightY, size: 11, font: fontBold, color: primaryColor });
  rightY -= 14;
  page1.drawText('Company Name : AR Digital Sign', { x: rightX, y: rightY, size: 9, font: fontBold, color: darkTextColor });
  rightY -= 13;
  page1.drawText('Near to Boro Bridge, Abdul Hamid Road, Pabna', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });
  rightY -= 13;
  page1.drawText('Period: 2022 to till Now', { x: rightX, y: rightY, size: 8.5, font: fontOblique, color: primaryColor });
  rightY -= 22;

  // Experience 2: Graphic Designer (Sunam Graph)
  page1.drawText('Graphic Designer', { x: rightX, y: rightY, size: 11, font: fontBold, color: primaryColor });
  rightY -= 14;
  page1.drawText('Company Name : Sunam Graph', { x: rightX, y: rightY, size: 9, font: fontBold, color: darkTextColor });
  rightY -= 13;
  page1.drawText('Maksuda Mahal, Abdul Hamid Road, Pabna', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });
  rightY -= 13;
  page1.drawText('Period: 2019 to 2022', { x: rightX, y: rightY, size: 8.5, font: fontOblique, color: primaryColor });
  rightY -= 30;

  // Education
  page1.drawText('EDUCATION', {
    x: rightX,
    y: rightY,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawLine({
    start: { x: rightX, y: rightY - 5 },
    end: { x: 550, y: rightY - 5 },
    thickness: 1,
    color: primaryColor,
  });
  rightY -= 25;

  // HSC
  page1.drawText('Higher Secondary Certificate (HSC)', { x: rightX, y: rightY, size: 10, font: fontBold, color: primaryColor });
  rightY -= 13;
  page1.drawText('Institute: Islamia Digri College Pabna', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: darkTextColor });
  rightY -= 12;
  page1.drawText('Board: Rajshahi   |   Group: Commerce', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });
  rightY -= 12;
  page1.drawText('Result: 3.50 (Out of 5.00)   |   Passing Year: 2009', { x: rightX, y: rightY, size: 8.5, font: fontBold, color: darkTextColor });
  rightY -= 20;

  // SSC
  page1.drawText('Secondary School Certificate (SSC)', { x: rightX, y: rightY, size: 10, font: fontBold, color: primaryColor });
  rightY -= 13;
  page1.drawText('Institute: Gopal Chandra Institution Pabna', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: darkTextColor });
  rightY -= 12;
  page1.drawText('Board: Rajshahi   |   Group: Commerce', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });
  rightY -= 12;
  page1.drawText('Result: 2.50 (Out of 5.00)   |   Passing Year: 2007', { x: rightX, y: rightY, size: 8.5, font: fontBold, color: darkTextColor });
  rightY -= 30;

  // Computer Skills
  page1.drawText('COMPUTER SKILLS', {
    x: rightX,
    y: rightY,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawLine({
    start: { x: rightX, y: rightY - 5 },
    end: { x: 550, y: rightY - 5 },
    thickness: 1,
    color: primaryColor,
  });
  rightY -= 22;

  const computerSkills = [
    '• Adobe Illustrator (Expert)',
    '• Adobe Photoshop (Expert)',
    '• Graphic Design & Branding',
    '• Digital & Print Media Design',
    '• Color Knowledge About Offset Printing',
    '• Offset Printing Setup',
    '• Photo Editing & Retouching',
    '• Social Media Creative Design',
    '• Microsoft Office Applications'
  ];
  for (const s of computerSkills) {
    page1.drawText(s, { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: darkTextColor });
    rightY -= 14;
  }

  // References
  rightY -= 15;
  page1.drawText('REFERENCES', {
    x: rightX,
    y: rightY,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  page1.drawLine({
    start: { x: rightX, y: rightY - 5 },
    end: { x: 550, y: rightY - 5 },
    thickness: 1,
    color: primaryColor,
  });
  rightY -= 20;

  page1.drawText('Md. Khairul Islam Noion', { x: rightX, y: rightY, size: 9.5, font: fontBold, color: darkTextColor });
  rightY -= 13;
  page1.drawText('UI/UX Designer', { x: rightX, y: rightY, size: 8.5, font: fontBold, color: primaryColor });
  rightY -= 12;
  page1.drawText('Phone: 01744-132221', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });
  rightY -= 12;
  page1.drawText('Address: Banglabazar, Lanchghat, Pabna Sadar, Pabna.', { x: rightX, y: rightY, size: 8.5, font: fontRegular, color: mutedTextColor });


  // ==================== PAGE 2 ====================
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);

  let p2Y = 800;
  const p2X = 50;

  // Header
  page2.drawText('CURRICULUM VITAE — PAGE 2', {
    x: p2X,
    y: p2Y,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });
  page2.drawText('MD. ASHRAFUL ISLAM', {
    x: 440,
    y: p2Y,
    size: 10,
    font: fontBold,
    color: darkTextColor,
  });
  p2Y -= 10;
  page2.drawLine({
    start: { x: p2X, y: p2Y },
    end: { x: 545, y: p2Y },
    thickness: 1,
    color: borderColor,
  });
  p2Y -= 30;

  // Professional Qualification
  page2.drawText('PROFESSIONAL QUALIFICATION', {
    x: p2X,
    y: p2Y,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  p2Y -= 6;
  page2.drawLine({
    start: { x: p2X, y: p2Y },
    end: { x: 545, y: p2Y },
    thickness: 1,
    color: primaryColor,
  });
  p2Y -= 20;

  const profQuals = [
    '• Expertise in Adobe Illustrator and Adobe Photoshop for professional design projects.',
    '• Skilled in creating logos, branding materials, social media designs, banners, brochures, and marketing assets.',
    '• Strong understanding of typography, color theory, composition, and visual communication.',
    '• Experience in preparing designs for both digital platforms and print production.',
    '• Ability to develop creative concepts and deliver high-quality design solutions within deadlines.',
    '• Good knowledge of image editing, photo retouching, and layout design techniques.'
  ];
  for (const q of profQuals) {
    page2.drawText(q, { x: p2X, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });
    p2Y -= 16;
  }

  p2Y -= 20;

  // Personal Details
  page2.drawText('PERSONAL DETAILS', {
    x: p2X,
    y: p2Y,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });
  p2Y -= 6;
  page2.drawLine({
    start: { x: p2X, y: p2Y },
    end: { x: 545, y: p2Y },
    thickness: 1,
    color: primaryColor,
  });
  p2Y -= 20;

  const personalDetails = [
    { label: 'Name', value: 'Md. Ashraful Islam' },
    { label: "Father's Name", value: 'Late Abdul Aziz' },
    { label: "Mother's Name", value: 'Late Khadiza Begum' },
    { label: 'Date of Birth', value: 'January 12, 1992' },
    { label: 'Religion', value: 'Islam' },
    { label: 'Marital Status', value: 'Married' },
    { label: 'Nationality', value: 'Bangladeshi (By Birth)' },
    { label: 'Blood Group', value: 'O+ve' },
  ];

  for (const d of personalDetails) {
    page2.drawText(d.label, { x: p2X, y: p2Y, size: 9, font: fontBold, color: primaryColor });
    page2.drawText(':', { x: p2X + 110, y: p2Y, size: 9, font: fontBold, color: darkTextColor });
    page2.drawText(d.value, { x: p2X + 125, y: p2Y, size: 9, font: fontRegular, color: darkTextColor });
    p2Y -= 17;
  }

  p2Y -= 20;

  // Present Address & Permanent Address
  page2.drawText('PRESENT ADDRESS', {
    x: p2X,
    y: p2Y,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });
  page2.drawText('PERMANENT ADDRESS', {
    x: p2X + 260,
    y: p2Y,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });
  p2Y -= 6;
  page2.drawLine({
    start: { x: p2X, y: p2Y },
    end: { x: p2X + 220, y: p2Y },
    thickness: 1,
    color: borderColor,
  });
  page2.drawLine({
    start: { x: p2X + 260, y: p2Y },
    end: { x: 545, y: p2Y },
    thickness: 1,
    color: borderColor,
  });
  p2Y -= 18;

  // Present address content
  page2.drawText('Banglabazar, Lanchghat', { x: p2X, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });
  // Permanent address content
  page2.drawText('Vill : Charkushakhali', { x: p2X + 260, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });
  p2Y -= 14;

  page2.drawText('Pabna Sadar, Pabna.', { x: p2X, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });
  page2.drawText('P.O : Asutuspur', { x: p2X + 260, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });
  p2Y -= 14;

  page2.drawText('Bangladesh', { x: p2X, y: p2Y, size: 8.5, font: fontRegular, color: mutedTextColor });
  page2.drawText('UP : Pabna Sadar   |   Dist : Pabna', { x: p2X + 260, y: p2Y, size: 8.5, font: fontRegular, color: darkTextColor });

  p2Y -= 45;

  // Declaration
  page2.drawText('DECLARATION', {
    x: p2X,
    y: p2Y,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });
  p2Y -= 6;
  page2.drawLine({
    start: { x: p2X, y: p2Y },
    end: { x: 545, y: p2Y },
    thickness: 1,
    color: primaryColor,
  });
  p2Y -= 20;

  const declarationLines = [
    'I hereby declare that all the information provided in this CV is true, accurate, and',
    'complete to the best of my knowledge and belief. I take full responsibility for the',
    'authenticity of the information mentioned above and assure that I will perform my duties',
    'with sincerity, dedication, and professionalism.'
  ];
  for (const line of declarationLines) {
    page2.drawText(line, { x: p2X, y: p2Y, size: 8.5, font: fontRegular, color: mutedTextColor });
    p2Y -= 14;
  }

  // Signature Block
  p2Y -= 45;
  const sigX = 400;
  page2.drawLine({
    start: { x: sigX, y: p2Y },
    end: { x: 540, y: p2Y },
    thickness: 1,
    color: darkTextColor,
  });
  p2Y -= 14;
  page2.drawText('(Signature)', { x: sigX + 35, y: p2Y, size: 8.5, font: fontOblique, color: mutedTextColor });
  p2Y -= 14;
  page2.drawText('Md. Ashraful Islam', { x: sigX + 15, y: p2Y, size: 10, font: fontBold, color: darkTextColor });

  const pdfBytes = await pdfDoc.save();

  // Save to public directory
  const outputPath = path.join(process.cwd(), 'public', 'Md_Ashraful_Islam_CV.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Generated official CV PDF successfully at: ${outputPath}`);
}

createPdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
