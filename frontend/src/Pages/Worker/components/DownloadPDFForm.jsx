import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Snackbar, 
  Alert,
  Box,
  Typography,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DownloadPDFForm = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [weatherCondition, setWeatherCondition] = useState('all');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Extract unique city names from data
  useEffect(() => {
    if (data && data.length > 0) {
      const cities = [...new Set(data.map(item => item.city))];
      setCityOptions(cities);
    }
  }, [data]);

  const generatePDF = () => {
    if (!data || data.length === 0) {
      setError('No weather data available to generate report');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add logo at the top (centered and circular)
      const logo = new Image();
      logo.src = '/Logo.png'; // Path to logo in the public folder
      
      // Wait for the logo to load before adding it to the PDF
      logo.onload = function() {
        const logoSize = 40; // Size of the logo (adjust as needed)
        const xPos = (doc.internal.pageSize.width - logoSize) / 2; // Center the logo horizontally
        const yPos = 20; // Space between the top and logo
    
        // Draw circular logo
        doc.ellipse(xPos + logoSize / 2, yPos + logoSize / 2, logoSize / 2, logoSize / 2, 'F'); // Draw circle
    
        // Add the image inside the circular shape
        doc.addImage(logo, 'JPEG', xPos, yPos, logoSize, logoSize, null, 'SLOW');
    
        // Title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('Weather Report', 105, 20 + logoSize + 10, { align: 'center' });
    
        // Subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30 + logoSize + 10, { align: 'center' });
      
        // Apply filters
        let filteredData = [...data];
        
        // Filter by date if selected
        if (selectedDate) {
          filteredData = filteredData.filter(item => 
            dayjs(item.timestamp).isSame(selectedDate, 'day')
          );
        }
        
        // Filter by city if selected
        if (selectedCity) {
          filteredData = filteredData.filter(item => 
            item.city === selectedCity
          );
        }
        
        if (filteredData.length === 0) {
          doc.text('No data available for selected filters', 105, 50 + logoSize + 20, { align: 'center' });
        } else {
          // Prepare table data
          const headers = ['City', 'Time'];
          const weatherParams = [];
          
          if (weatherCondition === 'all') {
            weatherParams.push('temperature', 'feelsLike', 'humidity', 'windSpeed', 'uvIndex');
            headers.push('Temp (°C)', 'Feels Like', 'Humidity (%)', 'Wind (km/h)', 'UV Index');
          } else {
            weatherParams.push(weatherCondition);
            headers.push(
              weatherCondition === 'temperature' ? 'Temp (°C)' :
              weatherCondition === 'feelsLike' ? 'Feels Like' :
              weatherCondition === 'humidity' ? 'Humidity (%)' :
              weatherCondition === 'windSpeed' ? 'Wind (km/h)' : 'UV Index'
            );
          }
          
          // Add table to PDF
          autoTable(doc, {
            startY: 50 + logoSize + 20,
            head: [headers],
            body: filteredData.map(item => {
              const row = [
                item.city,
                dayjs(item.timestamp).format('h:mm A')
              ];
              
              weatherParams.forEach(param => {
                if (param === 'windSpeed') {
                  row.push((item[param] * 3.6).toFixed(1));
                } else if (param === 'uvIndex') {
                  row.push(item[param].toFixed(1));
                } else {
                  row.push(Math.round(item[param]));
                }
              });
              
              return row;
            }),
            styles: {
              cellPadding: 5,
              fontSize: 10,
              valign: 'middle'
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240]
            }
          });
        }
        
        // Generate filename based on filters
        let filename = 'weather_report';
        if (selectedDate) filename += `_${selectedDate.format('YYYY-MM-DD')}`;
        if (selectedCity) filename += `_${selectedCity.replace(/\s+/g, '_')}`;
        
        // Save the PDF
        doc.save(`${filename}.pdf`);
        
        setSuccess('PDF generated successfully!');
        setIsGenerating(false);
      };
      
      // Handle case where logo fails to load
      logo.onerror = function() {
        console.error('Failed to load logo');
        // Fallback to PDF without logo
        generatePDFWithoutLogo(doc);
      };
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Generate PDF Report
        </Typography>
        
        {/* Filter Options - Stacked Vertically */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {/* Date Filter */}
          <Box>
            <DatePicker
              label="Filter by Date (optional)"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              maxDate={dayjs()}
            />
          </Box>

          {/* City Filter */}
          <Box>
            <FormControl fullWidth>
              <Autocomplete
                options={cityOptions}
                value={selectedCity}
                onChange={(event, newValue) => setSelectedCity(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Filter by City (optional)" 
                    fullWidth 
                  />
                )}
                isOptionEqualToValue={(option, value) => option === value}
              />
            </FormControl>
          </Box>

          {/* Weather Parameter Filter */}
          <Box>
            <FormControl fullWidth>
              <InputLabel>Weather Parameter</InputLabel>
              <Select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                label="Weather Parameter"
              >
                <MenuItem value="all">All Data</MenuItem>
                <MenuItem value="temperature">Temperature</MenuItem>
                <MenuItem value="feelsLike">Feels Like</MenuItem>
                <MenuItem value="humidity">Humidity</MenuItem>
                <MenuItem value="windSpeed">Wind Speed</MenuItem>
                <MenuItem value="uvIndex">UV Index</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Download Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained"
            onClick={generatePDF}
            disabled={isGenerating || !data || data.length === 0}
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
              minWidth: 200,
              padding: '10px 24px',
              fontSize: '1rem'
            }}
          >
            {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
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
    </LocalizationProvider>
  );
};

export default DownloadPDFForm;