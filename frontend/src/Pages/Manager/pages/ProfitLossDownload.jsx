import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx'; // For CSV export
import { Button, TextField, Box, Snackbar, Alert, Typography } from '@mui/material';

export default function ProfitLossDownload() {
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to download the report as a CSV
  const generateCSV = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Send JWT token
          },
        }
      );
      const data = response.data;

      const csvData = [
        ['Category', 'Amount (LKR)'],
        ...Object.entries(data.incomeMap || {}).map(([key, value]) => [key, value]),
        ['Total Income', data.totalIncome],
        ...Object.entries(data.expenseMap || {}).map(([key, value]) => [key, value]),
        ['Total Expenses', data.totalExpense],
        ['Net Profit/Loss', data.profitOrLoss],
      ];

      const ws = XLSX.utils.aoa_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Profit & Loss Report');
      XLSX.writeFile(wb, 'profit_loss_report.csv');
    } catch (err) {
      console.error('Error generating CSV:', err);
      setError('Failed to generate CSV');
    }
  };

  // Function to download the report as a PDF
  const generatePDF = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Send JWT token
          },
        }
      );
      const data = response.data;

      const doc = new jsPDF();
      const marginLeft = 20;
      let y = 20;

      doc.setFontSize(18);
      doc.text('Profit & Loss Statement', marginLeft, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Reporting Period: ${startDate} to ${endDate}`, marginLeft, y);
      y += 10;

      // Income Section
      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34); // Dark green
      doc.text('INCOME', marginLeft, y);
      y += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const income = data.incomeMap || {};
      Object.keys(income).forEach((key) => {
        doc.text(key, marginLeft + 10, y);
        doc.text(`LKR ${income[key]}`, 180, y, { align: 'right' });
        y += 8;
      });
      y += 2;
      doc.setFont(undefined, 'bold');
      doc.text('Total Income:', marginLeft + 10, y);
      doc.text(`LKR ${data.totalIncome}`, 180, y, { align: 'right' });
      y += 15;

      // Expenses Section
      doc.setFont(undefined, 'normal');
      doc.setFontSize(14);
      doc.setTextColor(220, 20, 60); // Crimson
      doc.text('EXPENSES', marginLeft, y);
      y += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const expense = data.expenseMap || {};
      Object.keys(expense).forEach((key) => {
        doc.text(key, marginLeft + 10, y);
        doc.text(`LKR ${expense[key]}`, 180, y, { align: 'right' });
        y += 8;
      });
      y += 2;
      doc.setFont(undefined, 'bold');
      doc.text('Total Expenses:', marginLeft + 10, y);
      doc.text(`LKR ${data.totalExpense}`, 180, y, { align: 'right' });
      y += 15;

      // Profit/Loss Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 139); // Dark blue
      doc.text('NET PROFIT / LOSS', marginLeft, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`LKR ${data.profitOrLoss}`, marginLeft + 10, y);

      // Footer with generated date
      y += 20;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginLeft, y);

      doc.save('profit_loss_statement.pdf');
      setSuccess('PDF generated successfully!');
      setIsGenerating(false);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
      setIsGenerating(false);
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generate Profit & Loss Statement
      </Typography>

      {/* Date Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: '200px' }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ width: '200px' }}
        />
      </Box>

      {/* Download Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained"
          color="error"
          onClick={generateCSV}
          disabled={isGenerating || !startDate || !endDate}
        >
          {isGenerating ? 'Generating CSV...' : 'Download CSV'}
        </Button>
        <Button 
          variant="contained"
          color="success"
          onClick={generatePDF}
          disabled={isGenerating || !startDate || !endDate}
        >
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </Box>

      {/* Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

