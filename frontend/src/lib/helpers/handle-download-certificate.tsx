// import jsPDF from "jspdf";

// type CertificateOptions = {
//   userName: string;
//   courseName: string;
//   date: string;
//   certContent?: string; // optional custom content
// };

// /**
//  * Generates and downloads a PDF certificate for a user
//  * @param {CertificateOptions} options - Options containing certificate details
//  */
// const handleDownloadCertificate = (options: CertificateOptions): void => {
//   const {
//     userName,
//     courseName,
//     date,
//     certContent = "",
//   } = options;

//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "pt",
//     format: "a4"
//   });

//   // Add certificate content -- style as needed
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(24);
//   doc.text("Certificate of Completion", 295, 100, { align: "center" });

//   doc.setFontSize(16);
//   doc.text("This certifies that", 295, 160, { align: "center" });
//   doc.setFontSize(20);
//   doc.text(userName, 295, 190, { align: "center" });
//   doc.setFontSize(16);
//   doc.text("has successfully completed the course:", 295, 230, { align: "center" });
//   doc.setFontSize(20);
//   doc.text(courseName, 295, 260, { align: "center" });

//   // Custom content (optional)
//   if (certContent) {
//     doc.setFontSize(14);
//     doc.text(certContent, 295, 300, { align: "center" });
//   }

//   doc.setFontSize(12);
//   doc.text(`Date: ${date}`, 295, 340, { align: "center" });

//   // Save/download
//   doc.save(`certificate_${userName}_${courseName}.pdf`);
// };

// export default handleDownloadCertificate;


import jsPDF from "jspdf";

type CertificateOptions = {
  userName: string;
  courseName: string;
  date: string;
  certContent?: string;
  platformName?: string;
  instructorName?: string;
  courseHours?: string;
};

/**
 * Generates and downloads a professional PDF certificate
 * @param {CertificateOptions} options - Certificate details
 */
const handleDownloadCertificate = (options: CertificateOptions): void => {
  const {
    userName,
    courseName,
    date,
    certContent = "",
    platformName = "Coursewave",
    instructorName = "Coursewave Instructor",
    courseHours = "8"
  } = options;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border with gradient effect (simulated with rectangles)
  doc.setDrawColor(41, 98, 255);
  doc.setLineWidth(3);
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60, 'S');
  
  doc.setDrawColor(100, 149, 237);
  doc.setLineWidth(1);
  doc.rect(35, 35, pageWidth - 70, pageHeight - 70, 'S');

  // Decorative corner elements
  doc.setFillColor(41, 98, 255);
  // Top left corner
  doc.circle(50, 50, 8, 'F');
  // Top right corner
  doc.circle(pageWidth - 50, 50, 8, 'F');
  // Bottom left corner
  doc.circle(50, pageHeight - 50, 8, 'F');
  // Bottom right corner
  doc.circle(pageWidth - 50, pageHeight - 50, 8, 'F');

  // Platform logo placeholder (you can replace this with actual logo)
  doc.setFillColor(41, 98, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 98, 255);
  doc.text(platformName, pageWidth / 2, 80, { align: "center" });
  
  // Subtitle under platform name
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("ONLINE LEARNING PLATFORM", pageWidth / 2, 95, { align: "center" });

  // Certificate title
  doc.setFontSize(40);
  doc.setFont("times", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Certificate of Completion", pageWidth / 2, 150, { align: "center" });

  // Decorative line under title
  doc.setDrawColor(41, 98, 255);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 100, 160, pageWidth / 2 + 100, 160);

  // "This certifies that" text
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("This is to certify that", pageWidth / 2, 195, { align: "center" });

  // User name (highlighted)
  doc.setFontSize(32);
  doc.setFont("times", "bolditalic");
  doc.setTextColor(41, 98, 255);
  doc.text(userName, pageWidth / 2, 235, { align: "center" });
  
  // Underline for name
  const nameWidth = doc.getTextWidth(userName);
  doc.setDrawColor(41, 98, 255);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - nameWidth / 2, 240, pageWidth / 2 + nameWidth / 2, 240);

  // "has successfully completed" text
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("has successfully completed the course", pageWidth / 2, 270, { align: "center" });

  // Course name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  
  // Handle long course names with text wrapping
  const maxWidth = 500;
  const courseLines = doc.splitTextToSize(courseName, maxWidth);
  const courseStartY = 305;
  courseLines.forEach((line: string, index: number) => {
    doc.text(line, pageWidth / 2, courseStartY + (index * 28), { align: "center" });
  });

  // Custom content if provided
  if (certContent) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(certContent, pageWidth / 2, courseStartY + (courseLines.length * 28) + 20, { align: "center" });
  }

  // Bottom section with date and details
  const bottomY = pageHeight - 120;
  
  // Left section - Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Date of Completion", 120, bottomY);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(date, 120, bottomY + 20);
  doc.setDrawColor(200, 200, 200);
  doc.line(80, bottomY + 30, 220, bottomY + 30);

  // Center section - Course Length
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Course Length", pageWidth / 2, bottomY, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(`${courseHours} hours`, pageWidth / 2, bottomY + 20, { align: "center" });
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth / 2 - 70, bottomY + 30, pageWidth / 2 + 70, bottomY + 30);

  // Right section - Instructor
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Instructor", pageWidth - 120, bottomY, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(instructorName, pageWidth - 120, bottomY + 20, { align: "center" });
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 220, bottomY + 30, pageWidth - 80, bottomY + 30);

  // Footer text
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Certificate ID: ${Date.now()}-${userName.substring(0, 3).toUpperCase()}`,
    pageWidth / 2,
    pageHeight - 50,
    { align: "center" }
  );

  // Save the PDF
  const fileName = `${platformName}_Certificate_${userName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

export default handleDownloadCertificate;

// Example usage:
// handleDownloadCertificate({
//   userName: "John Doe",
//   courseName: "Advanced React Development",
//   date: "January 15, 2025",
//   platformName: "YourPlatform",
//   instructorName: "Jane Smith",
//   courseHours: "12",
//   certContent: "With distinction and excellence"
// });