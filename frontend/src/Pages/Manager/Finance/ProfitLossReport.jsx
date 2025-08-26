import React, { useState } from 'react';
import axios from 'axios';

const ProfitLossReport = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    // Fetch the report from the backend
    const fetchReport = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both start and end dates.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('/api/finance-reports', {
                params: { fromDate, toDate }
            });
            setReportData(response.data); // Assuming your backend sends data in response
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    // Download CSV
    const downloadCSV = () => {
        const data = [
            ['Transaction ID', 'Date', 'Type', 'Category', 'Amount (LKR)'],
            // Map your data to CSV format here
            // For example:
            ...reportData.transactions.map(txn => [
                txn.tid, txn.date, txn.type, txn.category, txn.amount
            ])
        ];
        
        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'financial_report.csv';
        link.click();
    };

    // Download PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Profit and Loss Report", 20, 10);
        doc.autoTable({
            head: [['Transaction ID', 'Date', 'Type', 'Category', 'Amount (LKR)']],
            body: reportData.transactions.map(txn => [
                txn.tid, txn.date, txn.type, txn.category, txn.amount
            ])
        });
        doc.save('financial_report.pdf');
    };

    return (
        <div>
            <h1>Generate Profit and Loss Report</h1>
            
            <div>
                <label>From Date: </label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                <label>To Date: </label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <button onClick={fetchReport} disabled={loading}>
                {loading ? 'Loading...' : 'Generate Report'}
            </button>

            {reportData && (
                <div>
                    <h2>Report Summary:</h2>
                    <p>Total Income: LKR {reportData.totalIncome}</p>
                    <p>Total Expense: LKR {reportData.totalExpense}</p>
                    <p>Net Profit/Loss: LKR {reportData.netProfitLoss}</p>

                    <button onClick={downloadCSV}>Download CSV</button>
                    <button onClick={downloadPDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default ProfitLossReport;
