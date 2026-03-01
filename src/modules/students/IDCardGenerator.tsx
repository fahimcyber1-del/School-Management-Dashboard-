import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  roll: number;
  photo?: string;
}

interface IDCardGeneratorProps {
  student: Student;
  onClose: () => void;
}

export default function IDCardGenerator({ student, onClose }: IDCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!cardRef.current) return;
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // html2canvas fails on modern color functions like oklab/oklch
        // Strip all existing styles to prevent the parser from hitting problematic colors
        const styleSheets = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
        styleSheets.forEach(s => s.remove());

        // Add only the essential styles for the ID card
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          * { 
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
          }
          .id-card {
            width: 250px;
            height: 400px;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            padding: 20px 15px;
            color: white;
            text-align: center;
            border-bottom: 4px solid #fbbf24;
          }
          .header h3 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.025em; font-weight: 800; }
          .header p { font-size: 9px; opacity: 0.8; margin-top: 2px; }
          .body {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 15px;
          }
          .photo-wrapper {
            width: 110px;
            height: 110px;
            padding: 4px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 15px;
            border: 1px solid #e2e8f0;
          }
          .photo-container {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .photo-container img { width: 100%; height: 100%; object-fit: cover; }
          .photo-container span { font-size: 32px; font-weight: 800; color: #94a3b8; }
          .name { font-size: 18px; font-weight: 800; text-align: center; margin-bottom: 2px; color: #1e3a8a; text-transform: uppercase; }
          .role { color: #64748b; font-weight: 600; font-size: 11px; margin-bottom: 15px; letter-spacing: 0.1em; }
          .info-grid {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 5px;
          }
          .info-item { display: flex; flex-direction: column; gap: 2px; }
          .info-label { font-size: 8px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
          .info-value { font-size: 12px; font-weight: 700; color: #334155; }
          .footer {
            background: #f8fafc;
            padding: 15px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p { font-size: 9px; color: #94a3b8; font-weight: 600; margin-bottom: 8px; }
          .barcode-placeholder {
            width: 100%;
            height: 24px;
            background: repeating-linear-gradient(90deg, #000, #000 1px, #fff 1px, #fff 3px);
            opacity: 0.6;
            border-radius: 2px;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size (CR80)
    });

    // Add image to PDF, fitting the card size
    pdf.addImage(imgData, 'PNG', 0, 0, 54, 85.6);
    pdf.save(`${student.id}_ID_Card.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        .id-card {
          width: 250px;
          height: 400px;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 20px 15px;
          color: white;
          text-align: center;
          border-bottom: 4px solid #fbbf24;
        }
        .header h3 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.025em; font-weight: 800; margin: 0; }
        .header p { font-size: 9px; opacity: 0.8; margin: 2px 0 0; }
        .body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 15px;
        }
        .photo-wrapper {
          width: 110px;
          height: 110px;
          padding: 4px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
          border: 1px solid #e2e8f0;
        }
        .photo-container {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photo-container img { width: 100%; height: 100%; object-fit: cover; }
        .photo-container span { font-size: 32px; font-weight: 800; color: #94a3b8; }
        .name { font-size: 18px; font-weight: 800; text-align: center; margin-bottom: 2px; color: #1e3a8a; text-transform: uppercase; }
        .role { color: #64748b; font-weight: 600; font-size: 11px; margin-bottom: 15px; letter-spacing: 0.1em; }
        .info-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 5px;
        }
        .info-item { display: flex; flex-direction: column; gap: 2px; }
        .info-label { font-size: 8px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .info-value { font-size: 12px; font-weight: 700; color: #334155; }
        .footer {
          background: #f8fafc;
          padding: 15px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p { font-size: 9px; color: #94a3b8; font-weight: 600; margin: 0 0 8px 0; }
        .barcode-placeholder {
          width: 100%;
          height: 24px;
          background: repeating-linear-gradient(90deg, #000, #000 1px, #fff 1px, #fff 3px);
          opacity: 0.6;
          border-radius: 2px;
        }
      `}} />
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>Student ID Card Preview</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center gap-6">
          {/* ID Card Design */}
          <div 
            ref={cardRef}
            className="id-card"
          >
            {/* Header */}
            <div className="header">
              <h3>Dhaka Model School</h3>
              <p>Mirpur 10, Dhaka, Bangladesh</p>
            </div>

            {/* Body */}
            <div className="body">
              <div className="photo-wrapper">
                <div className="photo-container">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span>{student.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              
              <h2 className="name">{student.name}</h2>
              <p className="role">STUDENT</p>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Student ID</span>
                  <span className="info-value">{student.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Roll No</span>
                  <span className="info-value">{student.roll}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Class</span>
                  <span className="info-value">{student.class}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Section</span>
                  <span className="info-value">{student.section}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p>Academic Session 2024-25</p>
              <div className="barcode-placeholder" />
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button className="flex-1" onClick={exportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
