import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, ArrowLeftIcon, XIcon, CalendarIcon } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { AuthContext } from '../../Login/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllWorkLogsPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [groupedWorkLogs, setGroupedWorkLogs] = useState({});
  const [allWorkLogs, setAllWorkLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('B');
  const [dateFilter, setDateFilter] = useState(null);
  const [filterType, setFilterType] = useState('day'); // 'day', 'month', or 'year'
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/batch-processes/getBatches', {
          params: { userEmail: user.email },
          withCredentials: true,
        });
        setAllWorkLogs(response.data);
        const groupedData = processBatchData(response.data);
        setGroupedWorkLogs(groupedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const processBatchData = (batches) => {
    return batches.reduce((acc, batch) => {
      const date = new Date(batch.startTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(batch);
      return acc;
    }, {});
  };

  const filterByDate = (batches, date, type) => {
    if (!date) return batches;
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow future dates
    if (selectedDate > today) {
      return [];
    }

    return batches.filter(batch => {
      const batchDate = new Date(batch.startTime);
      switch (type) {
        case 'day':
          return (
            batchDate.getDate() === selectedDate.getDate() &&
            batchDate.getMonth() === selectedDate.getMonth() &&
            batchDate.getFullYear() === selectedDate.getFullYear()
          );
        case 'month':
          return (
            batchDate.getMonth() === selectedDate.getMonth() &&
            batchDate.getFullYear() === selectedDate.getFullYear()
          );
        case 'year':
          return batchDate.getFullYear() === selectedDate.getFullYear();
        default:
          return true;
      }
    });
  };

  const handleSearchChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('B')) {
      value = 'B' + value.replace(/[^0-9]/g, '');
    } else {
      value = 'B' + value.slice(1).replace(/[^0-9]/g, '');
    }
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm('B');
  };

  const clearDateFilter = () => {
    setDateFilter(null);
  };

  const getFilteredBatches = () => {
    let filtered = allWorkLogs;
    
    // Apply date filter first
    if (dateFilter) {
      filtered = filterByDate(filtered, dateFilter, filterType);
    }
    
    // Then apply search term filter
    if (searchTerm.length > 1) {
      filtered = filtered.filter(batch =>
        batch.batchId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return processBatchData(filtered);
  };

  const filteredGroupedWorkLogs = getFilteredBatches();

  const exportToExcel = () => {
    try {
      const allBatches = Object.values(filteredGroupedWorkLogs).flat();

      if (allBatches.length === 0) {
        alert('No data to export');
        return;
      }

      const excelData = allBatches.map((batch) => ({
        'Batch ID': batch.batchId,
        Date: new Date(batch.startTime).toLocaleDateString(),
        'Start Time': new Date(batch.startTime).toLocaleTimeString(),
        'End Time': batch.endTime ? new Date(batch.endTime).toLocaleTimeString() : '—',
        'Initial Moisture (%)': batch.initialMoisture,
        'Final Moisture (%)': batch.finalMoisture || '—',
        Status: batch.endTime ? 'COMPLETED' : 'RUNNING',
        'Duration (mins)': batch.endTime
          ? Math.round((new Date(batch.endTime) - new Date(batch.startTime)) / 60000)
          : '—',
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);

      if (!ws['!cols']) ws['!cols'] = [];
      ws['!cols'][0] = { wch: 15 };
      ws['!cols'][1] = { wch: 12 };
      ws['!cols'][2] = { wch: 12 };

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'WorkLogs');

      let fileName = 'work-logs';
      if (dateFilter) {
        const dateStr = new Date(dateFilter).toISOString().slice(0, 10);
        switch (filterType) {
          case 'day':
            fileName += `-${dateStr}`;
            break;
          case 'month':
            fileName += `-${dateStr.slice(0, 7)}`;
            break;
          case 'year':
            fileName += `-${dateStr.slice(0, 4)}`;
            break;
        }
      }
      fileName += `-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export Excel file');
    }
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      const allBatches = Object.values(filteredGroupedWorkLogs).flat();

      if (allBatches.length === 0) {
        alert('No data to export');
        return;
      }

      const logo = new Image();
      logo.src = '/Logo.png';

      await new Promise((resolve) => {
        logo.onload = resolve;
      });

      const logoSize = 40;
      const xPos = (doc.internal.pageSize.width - logoSize) / 2;
      const yPos = 20;

      doc.setFillColor(240, 240, 240);
      doc.ellipse(xPos + logoSize / 2, yPos + logoSize / 2, logoSize / 2, logoSize / 2, 'F');

      doc.addImage(logo, 'PNG', xPos, yPos, logoSize, logoSize, undefined, 'MEDIUM');

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      
      let reportTitle = 'CocoPro - Work Logs Report';
      if (dateFilter) {
        const dateStr = new Date(dateFilter).toLocaleDateString();
        switch (filterType) {
          case 'day':
            reportTitle += ` (${dateStr})`;
            break;
          case 'month':
            reportTitle += ` (${new Date(dateFilter).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
            break;
          case 'year':
            reportTitle += ` (${new Date(dateFilter).getFullYear()})`;
            break;
        }
      }
      
      doc.text(reportTitle, 105, yPos + logoSize + 15, null, null, 'center');

      doc.setFontSize(10);
      doc.text(
        `Report generated: ${new Date().toLocaleDateString()}`,
        105,
        yPos + logoSize + 25,
        null,
        null,
        'center'
      );

      let startY = yPos + logoSize + 35;

      Object.entries(filteredGroupedWorkLogs).forEach(([date, batches]) => {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(date, 14, startY);
        startY += 8;

        const tableData = batches.map((batch) => [
          batch.batchId,
          new Date(batch.startTime).toLocaleTimeString(),
          batch.endTime ? new Date(batch.endTime).toLocaleTimeString() : '—',
          `${batch.initialMoisture}% / ${batch.finalMoisture || '—'}%`,
          batch.endTime ? 'COMPLETED' : 'RUNNING',
        ]);

        autoTable(doc, {
          head: [['Batch ID', 'Start Time', 'End Time', 'Moisture', 'Status']],
          body: tableData,
          startY,
          theme: 'grid',
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          styles: {
            fontSize: 9,
            cellPadding: 2,
          },
          margin: { left: 14 },
        });

        startY = doc.lastAutoTable.finalY + 10;

        if (startY > 280) {
          doc.addPage();
          startY = 20;
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} • © ${new Date().getFullYear()} CocoPro`,
          105,
          287,
          null,
          null,
          'center'
        );
      }

      let pdfFileName = 'CocoPro_WorkLogs';
      if (dateFilter) {
        const dateStr = new Date(dateFilter).toISOString().slice(0, 10);
        switch (filterType) {
          case 'day':
            pdfFileName += `_${dateStr}`;
            break;
          case 'month':
            pdfFileName += `_${dateStr.slice(0, 7)}`;
            break;
          case 'year':
            pdfFileName += `_${dateStr.slice(0, 4)}`;
            break;
        }
      }
      pdfFileName += `_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      doc.save(pdfFileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF report');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Please log in to view work logs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 w-fit"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Profile
        </button>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">🔎</span>
            </div>
            <input
              type="text"
              placeholder="Search batch ID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm.length > 1 && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex items-center border rounded-md px-3 bg-white">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <DatePicker
                selected={dateFilter}
                onChange={(date) => setDateFilter(date)}
                maxDate={new Date()}
                placeholderText="Filter by date"
                className="border-none focus:outline-none w-32"
                showMonthYearPicker={filterType === 'month'}
                showYearPicker={filterType === 'year'}
                dateFormat={
                  filterType === 'day' ? 'yyyy-MM-dd' :
                  filterType === 'month' ? 'MMMM yyyy' : 'yyyy'
                }
              />
              {dateFilter && (
                <button
                  onClick={clearDateFilter}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>

            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 whitespace-nowrap"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              PDF
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">All Work Logs</h1>

      {Object.keys(filteredGroupedWorkLogs).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No batches found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {Object.entries(filteredGroupedWorkLogs).map(([date, batches]) => (
            <div key={date}>
              <div className="px-6 py-3 bg-gray-100 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">{date}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {batches.map((batch) => (
                  <div
                    key={batch.batchId}
                    className="px-6 py-4 hover:bg-gray-50 grid grid-cols-5 text-sm"
                  >
                    <div className="font-medium text-gray-800">{batch.batchId}</div>
                    <div>{new Date(batch.startTime).toLocaleTimeString()}</div>
                    <div>{batch.endTime ? new Date(batch.endTime).toLocaleTimeString() : '—'}</div>
                    <div>
                      {batch.initialMoisture}% / {batch.finalMoisture || '—'}%
                    </div>
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          batch.endTime
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {batch.endTime ? 'COMPLETED' : 'RUNNING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllWorkLogsPage;