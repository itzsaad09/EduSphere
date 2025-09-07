import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Certificate.css';

export default function App({ recipientName = '[Recipient Name]', courceName = '[Course Name]', issueDate = '[Issue Date]', certificateId = '[Certificate ID]' }) {
  issueDate = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = () => {
    const certificateElement = document.querySelector('.certificate');
    if (certificateElement) {
      // Temporarily create and add a style block with non-responsive CSS
      const style = document.createElement('style');
      style.innerHTML = `
        .certificate {
          width: 1123px !important;
          max-width: 1123px !important;
          min-height: 794px !important;
          padding: 40px !important;
        }

        .main-title {
          font-size: 4.5rem !important;
        }

        .sub-title {
          font-size: 3rem !important;
          margin-bottom: 2rem !important;
        }

        .recipient-name {
          font-size: 3.75rem !important;
          margin-bottom: 2rem !important;
        }

        .course-name {
          font-size: 3rem !important;
          margin-bottom: 2rem !important;
        }

        .text-normal {
          font-size: 1.25rem !important;
          margin-bottom: 1rem !important;
        }
        
        .footer-certificate {
          margin-top: 3rem !important;
        }
        
        .signature-text {
          font-size: 1.5rem !important;
        }
        
        .date-text {
          font-size: 0.875rem !important;
        }
      `;
      document.head.appendChild(style);

      // Add a small delay to ensure the DOM is updated before capturing
      setTimeout(() => {
        html2canvas(certificateElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
          
          const padding = 40; // Adjust this value to change the padding size
          
          // Add the captured image to the PDF with padding
          pdf.addImage(
            imgData, 
            'PNG', 
            padding, 
            padding, 
            canvas.width - (padding * 2), 
            canvas.height - (padding * 2)
          );
          
          pdf.save(`Certificate_of_Achievement_${recipientName}.pdf`);
          
          // Clean up: remove the temporary style block
          document.head.removeChild(style);
        });
      }, 100); // 100ms delay
    }
  };

  return (
    <>
      <div className="certificate-page-container">
        <div className="certificate">
          {/* Engraved Certificate ID */}
          <div className="engraved-text">
            Certificate ID: {certificateId}
          </div>
          {/* Doodle corners */}
          <div className="doodle left-top">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0 L32.3 17.7 50 19.5 36.5 31.8 40.5 49.3 25 40.2 9.5 49.3 13.5 31.8 0 19.5 17.7 17.7 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="doodle right-top">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0 L32.3 17.7 50 19.5 36.5 31.8 40.5 49.3 25 40.2 9.5 49.3 13.5 31.8 0 19.5 17.7 17.7 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="doodle left-bottom">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0 L32.3 17.7 50 19.5 36.5 31.8 40.5 49.3 25 40.2 9.5 49.3 13.5 31.8 0 19.5 17.7 17.7 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="doodle right-bottom">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0 L32.3 17.7 50 19.5 36.5 31.8 40.5 49.3 25 40.2 9.5 49.3 13.5 31.8 0 19.5 17.7 17.7 Z" fill="currentColor"/>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <h1 className="main-title">EduSphere</h1>
              <h2 className="sub-title">Certificate of Achievement</h2>
              <p className="text-normal">This certifies that</p>
              <p className="recipient-name">{recipientName}</p>
              <p className="text-normal">has successfully completed the course</p>
              <p className="course-name">{courceName}</p>
              <p className="text-normal">at EduSphere with distinction.</p>
            </div>
            
            <div className="footer-certificate">
              <div className="stamp-and-signature-group">
                {/* Stamp/Seal */}
                <div className="stamp-container">
                  <svg className="stamp-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 50 5 a 45 45 0 0 1 0 90 a 45 45 0 0 1 0 -90" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="50" y="38" fontSize="12" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" fill="currentColor">EST. 2023</text>
                    <text x="50" y="58" fontSize="16" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" fill="currentColor">EduSphere</text>
                  </svg>
                </div>

                {/* Signature and Date */}
                <div className="signature-section">
                  <div className="signature-line">
                    <p className="signature-text">Authorized Signature</p>
                  </div>
                  <div className="date-text">
                    <p>Issued: {issueDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="download-button-container">
          <button onClick={handleDownload} className="download-button">Download Certificate</button>
        </div>
      </div>
    </>
  );
}