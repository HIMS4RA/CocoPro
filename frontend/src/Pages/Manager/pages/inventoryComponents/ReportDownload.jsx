import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [nameFilter, setNameFilter] = useState('');  // Name filter instead of date filter
  const [filterType, setFilterType] = useState('both'); // 'raw-materials', 'finished-products', 'both'

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const finishedRes = await fetch('http://localhost:8080/api/finished-products/get');
        const rawRes = await fetch('http://localhost:8080/api/raw-materials');
        
        const finishedData = await finishedRes.json();
        const rawData = await rawRes.json();

        setFinishedProducts(finishedData);
        setRawMaterials(rawData);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data');
      }
    };
    fetchData();
  }, []);

  // Handle CSV download
  const handleDownloadCSV = async () => {
    setIsLoading(true);

    try {
      const params = {
        name: nameFilter,
        filterType: filterType
      };

      const response = await fetch(`http://localhost:8080/api/reports?name=${params.name}&filterType=${params.filterType}`);
      const data = await response.text(); // Assuming backend returns the CSV content as text

      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      console.error('Error creating CSV:', err);
      setError('Failed to generate CSV report');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsLoading(true);

    try {
      const params = {
        name: nameFilter,
        filterType: filterType
      };

      const response = await fetch(`http://localhost:8080/api/reports?name=${params.name}&filterType=${params.filterType}`);
      const data = await response.text(); // Assuming backend returns the PDF content as text

      const doc = new jsPDF();

      const logo = new Image();
      logo.src = '/Logo.png';
      logo.onload = function () {
        const logoSize = 40;
        const xPos = (doc.internal.pageSize.width - logoSize) / 2;
        const yPos = 20;

        doc.ellipse(xPos + logoSize / 2, yPos + logoSize / 2, logoSize / 2, logoSize / 2, 'F');
        doc.addImage(logo, 'JPEG', xPos, yPos, logoSize, logoSize, null, 'SLOW');

        generatePDFContent(doc, data);
      };
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('PDF generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF content with better layout and filtering applied to both Raw Materials and Finished Products
  const generatePDFContent = (doc, data) => {
    const yOffset = 70; // Starting position for the first content
    const margin = 10; // Margin for spacing
    const tableMargin = 20; // Margin for tables

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);  // Black text for the title
    doc.text('Inventory Report', 105, yOffset, null, null, 'center'); // Title at the center

    // Add current date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yOffset + 10, null, null, 'center');
    
    let startY = yOffset + 20; // Start position for content

    // --- Finished Products Section ---
    if (filterType === 'both' || filterType === 'finished-products') {
      doc.setFontSize(14);
      doc.setTextColor(33, 150, 243);  // Blue color for section header
      doc.text('Finished Products', margin, startY); // Section title

      startY += margin; // Increase the vertical offset for the table
      const finishedProductData = finishedProducts
        .filter(p => p.productName.toLowerCase().includes(nameFilter.toLowerCase())) // Apply name filter here
        .map(p => [
          p.productName,
          p.quantityUsed,
          p.unit,
          new Date(p.createdAt).toLocaleDateString(),
        ]);

      // Add table for Finished Products
      autoTable(doc, {
        startY: startY,
        head: [['Product Name', 'Quantity Used', 'Unit', 'Date']],
        body: finishedProductData,
        theme: 'striped',
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontSize: 12,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { left: margin, right: margin },
      });

      startY = doc.lastAutoTable.finalY + tableMargin; // Update startY to the end of the table
    }

    // --- Raw Materials Section ---
    if (filterType === 'both' || filterType === 'raw-materials') {
      doc.setFontSize(14);
      doc.setTextColor(33, 150, 243);  // Blue color for section header
      doc.text('Raw Materials', margin, startY); // Section title

      startY += margin; // Increase the vertical offset for the table
      const rawMaterialData = rawMaterials
        .filter(r => r.name.toLowerCase().includes(nameFilter.toLowerCase())) // Apply name filter here
        .map(r => [
          r.name,
          r.quantity,
          r.unit,
          r.supplier?.name || 'N/A',
          new Date(r.createdAt).toLocaleDateString(),
        ]);

      // Add table for Raw Materials
      autoTable(doc, {
        startY: startY,
        head: [['Name', 'Quantity', 'Unit', 'Supplier', 'Date']],
        body: rawMaterialData,
        theme: 'striped',
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontSize: 12,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { left: margin, right: margin },
      });

      startY = doc.lastAutoTable.finalY + tableMargin; // Update startY to the end
    }

    doc.save('inventory_report.pdf');
    setSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Filter by name"
          className="filter-name-input"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-type-select"
        >
          <option value="both">Both</option>
          <option value="raw-materials">Raw Materials</option>
          <option value="finished-products">Finished Products</option>
        </select>

        <Button
          variant="contained"
          onClick={handleDownloadCSV}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Generating CSV...' : 'Download CSV'}
        </Button>

        <Button
          variant="contained"
          onClick={handleDownloadPDF}
          startIcon={<PictureAsPdfIcon />}
        >
          Download PDF
        </Button>
      </div>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Report downloaded successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportDownload;
