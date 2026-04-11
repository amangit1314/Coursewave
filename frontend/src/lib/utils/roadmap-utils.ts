import { roadmapTemplates } from "@/lib/config/roadmap-templates";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function getTemplateRoadmap(skill: string) {
  const normalizedQuery = skill.toLowerCase();
  
  // Try to find exact match first
  const exactMatch = Object.keys(roadmapTemplates).find(
    key => key.toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    return roadmapTemplates[exactMatch as keyof typeof roadmapTemplates];
  }

  // Try partial match
  const partialMatch = Object.keys(roadmapTemplates).find(
    key => normalizedQuery.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedQuery)
  );

  if (partialMatch) {
    return roadmapTemplates[partialMatch as keyof typeof roadmapTemplates];
  }

  // Default fallback
  return roadmapTemplates["backend developer"];
}



export function downloadRoadmap(roadmap: any, filename?: string, progress?: Record<string, boolean>) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 90, 200);
  doc.text(roadmap.title, 20, 30);

  // Add description
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(roadmap.description, 20, 45, { maxWidth: 170 });

  // Add metadata
  doc.setFontSize(10);
  doc.text(`Duration: ${roadmap.duration}`, 20, 65);
  doc.text(`Difficulty: ${roadmap.difficulty}`, 20, 75);
  doc.text(`Category: ${roadmap.category}`, 20, 85);

  // Prepare table data
  const tableData = roadmap.nodes.map((node: any, index: number) => [
    index + 1,
    node.title || node.data?.label,
    node.type || node.data?.type,
    node.estimatedTime || node.data?.estimatedTime,
    progress ? (progress[node.id] ? "✅ Completed" : "⏳ Pending") : ""
  ]);

  // Add table
  (doc as any).autoTable({
    startY: 100,
    head: [["#", "Skill", "Level", "Time", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [40, 90, 200],
      textColor: 255,
      fontSize: 11,
      fontStyle: "bold"
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 }
    }
  });

  // Add resources section if available
  if (roadmap.resources) {
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(40, 90, 200);
    doc.text("Recommended Resources", 20, finalY);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    let yPos = finalY + 10;
    roadmap.resources.forEach((resource: any) => {
      doc.text(`• ${resource.title}`, 25, yPos);
      doc.text(`  ${resource.url}`, 30, yPos + 5);
      yPos += 10;
    });
  }

  // Save the PDF
  doc.save(`${filename || roadmap.title.replace(/[^a-z0-9]/gi, '-')}.pdf`);
}