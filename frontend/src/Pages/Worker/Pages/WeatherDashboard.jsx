import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaLocationArrow, 
  FaTemperatureHigh, 
  FaTint, 
  FaWind, 
  FaSun 
} from 'react-icons/fa';
import { 
  Button, 
  Snackbar, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import { Download } from '@mui/icons-material';
import DownloadPDFForm from '../components/DownloadPDFForm.jsx';

// Constants
const CITIES = [
  { name: 'Colombo', lat: 6.9271, lon: 79.8612 },
  { name: 'Kandy', lat: 7.2906, lon: 80.6337 },
  { name: 'Galle', lat: 6.0323, lon: 80.2168 },
  { name: 'Jaffna', lat: 9.6615, lon: 80.0255 },
  { name: 'Anuradhapura', lat: 8.3114, lon: 80.4037 },
];

// API Service Functions
const weatherService = {
  fetchCurrentWeather: async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );
    return response.data;
  },
  saveReport: async (data) => {
    return axios.post('http://localhost:8080/api/weather/save', data);
  },
  getReports: async () => {
    return axios.get('http://localhost:8080/api/weather/report');
  }
};

const WeatherDashboard = () => {
  // State management
  const [state, setState] = useState({
    weatherData: null,
    forecastData: [],
    city: CITIES[0].name,
    searchQuery: '',
    userLocation: null,
    isLoading: false,
    isGeneratingReport: false,
    isDownloading: false,
    error: null,
    success: null,
    selectedCity: null,
    reportData: []
  });

  const {
    weatherData,
    forecastData,
    city,
    searchQuery,
    userLocation,
    isLoading,
    isGeneratingReport,
    isDownloading,
    error,
    success,
    selectedCity,
    reportData
  } = state;

  // Update state helper
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fetch weather data
  const fetchWeather = async (lat, lon, cityName = 'Current Location') => {
    updateState({ isLoading: true, error: null });
    
    try {
      const data = await weatherService.fetchCurrentWeather(lat, lon);
      
      updateState({
        weatherData: {
          city: cityName,
          temperature: data.current.temp,
          feelsLike: data.current.feels_like,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_speed,
          uvIndex: data.current.uvi,
          weatherIcon: data.current.weather[0].icon,
          description: data.current.weather[0].description,
          lat,
          lon
        },
        forecastData: data.daily.slice(1, 4), // 3-day forecast
        city: cityName,
        isLoading: false
      });
    } catch (err) {
      updateState({
        error: 'Failed to fetch weather data. Please try again.',
        isLoading: false
      });
    }
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      updateState({ isLoading: true, error: null });
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeather(latitude, longitude);
          updateState({
            userLocation: { lat: latitude, lon: longitude },
            isLoading: false
          });
        },
        (err) => {
          updateState({
            error: 'Location access denied. Using default location.',
            isLoading: false
          });
          fetchWeather(CITIES[0].lat, CITIES[0].lon, CITIES[0].name);
        }
      );
    } else {
      updateState({
        error: 'Geolocation not supported. Using default location.',
      });
      fetchWeather(CITIES[0].lat, CITIES[0].lon, CITIES[0].name);
    }
  };

  // Search for a city
  const searchCity = async () => {
    if (!searchQuery.trim()) {
      updateState({ error: 'Please enter a city name.' });
      return;
    }

    const isValidCity = /^[A-Za-z\s]+$/.test(searchQuery.trim());
    if (!isValidCity) {
      updateState({ error: 'City name must only contain letters.' });
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (response.data.length > 0) {
        const { lat, lon, name } = response.data[0];
        await fetchWeather(lat, lon, name);
      } else {
        updateState({
          error: 'City not found. Please try another search.',
          isLoading: false
        });
      }
    } catch (err) {
      updateState({
        error: 'Search failed. Please try again.',
        isLoading: false
      });
    }
  };

  // Fetch report data
  const fetchReportData = async () => {
    try {
      const response = await weatherService.getReports();
      updateState({ reportData: response.data });
    } catch (err) {
      updateState({ error: 'Failed to fetch report data' });
    }
  };

  // Generate weather report
  const handleGenerateReport = async () => {
    if (!weatherData) {
      updateState({ error: 'No weather data available' });
      return;
    }

    updateState({ isGeneratingReport: true, error: null });
    
    try {
      const reportData = {
        ...weatherData,
        timestamp: new Date().toISOString()
      };
      
      await weatherService.saveReport(reportData);
      await fetchReportData();
      updateState({
        success: 'Weather report generated successfully!',
        isGeneratingReport: false
      });
    } catch (err) {
      updateState({
        error: 'Failed to generate report. Please try again.',
        isGeneratingReport: false
      });
    }
  };

  // Download CSV report
  const handleDownloadCSV = async () => {
    updateState({ isDownloading: true, error: null });
    
    try {
      const response = await weatherService.getReports();
      const data = response.data;

      const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;
      
      const csvContent = [
        ['City', 'Temp (°C)', 'Feels Like', 'Humidity', 'Wind (km/h)', 'UV', 'Date']
          .map(escapeCsv).join(','),
        ...data.map(item => [
          item.city,
          item.temperature,
          item.feelsLike,
          item.humidity,
          (item.windSpeed * 3.6).toFixed(2),
          item.uvIndex,
          new Date(item.timestamp).toLocaleString()
        ].map(escapeCsv).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `weather_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      updateState({
        success: 'CSV report downloaded successfully!',
        isDownloading: false
      });
    } catch (err) {
      updateState({
        error: 'Failed to download CSV report',
        isDownloading: false
      });
    }
  };

  // Close alerts
  const handleCloseAlert = () => {
    updateState({ error: null, success: null });
  };

  // Initialize with default city
  useEffect(() => {
    fetchWeather(CITIES[0].lat, CITIES[0].lon, CITIES[0].name);
    fetchReportData();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e6f3ff)',
      padding: 4
    }}>
      <Box sx={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 3
      }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 4
        }}>
          <Typography variant="h3" component="h1" sx={{
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 2
          }}>
            Weather Dashboard
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{
            display: 'flex',
            width: '100%',
            maxWidth: 800,
            gap: 2,
            marginBottom: 2
          }}>
            <Box sx={{ position: 'relative', flexGrow: 1 }}>
              <FaSearch style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => {
                  const input = e.target.value;
                  const lettersOnly = input.replace(/[^A-Za-z\s]/g, '');
                  updateState({ searchQuery: lettersOnly });
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchCity()}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 16,
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              />
            </Box>
            
            <Button
              variant="contained"
              onClick={searchCity}
              disabled={isLoading}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': { backgroundColor: '#1d4ed8' },
                minWidth: 120
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
            
            <Button
              variant="contained"
              onClick={getUserLocation}
              disabled={isLoading}
              sx={{
                backgroundColor: '#334155',
                '&:hover': { backgroundColor: '#1e293b' },
                minWidth: 180
              }}
              startIcon={<FaLocationArrow />}
            >
              {isLoading ? 'Locating...' : 'My Location'}
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Weather Display - Main Content (Left Side) */}
          <Grid item xs={12} md={8}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ padding: 4 }}>
                {isLoading ? (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 300
                  }}>
                    <CircularProgress size={60} />
                  </Box>
                ) : weatherData ? (
                  <>
                    {/* Current Weather */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4
                    }}>
                      <Box>
                        <Typography variant="h4" component="h2" sx={{
                          fontWeight: 'bold',
                          color: '#1e293b'
                        }}>
                          {weatherData.city}
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: '#64748b',
                          textTransform: 'capitalize'
                        }}>
                          {weatherData.description}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#64748b' }}>
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                      gap: 4
                    }}>
                      {/* Temperature */}
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h1" sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          fontSize: '5rem',
                          lineHeight: 1
                        }}>
                          {Math.round(weatherData.temperature)}°C
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                          Feels like {Math.round(weatherData.feelsLike)}°C
                        </Typography>
                      </Box>

                      {/* Weather Icon */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <img
                          src={`https://openweathermap.org/img/wn/${weatherData.weatherIcon}@4x.png`}
                          alt="Weather icon"
                          style={{ width: 120, height: 120 }}
                        />
                      </Box>
                    </Box>

                    {/* Weather Highlights */}
                    <Typography variant="h5" component="h3" sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: 3
                    }}>
                      Today's Highlights
                    </Typography>

                    <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                      {/* Humidity */}
                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{
                          borderRadius: 2,
                          padding: 3,
                          height: '100%'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 1
                          }}>
                            <FaTint style={{
                              color: '#3b82f6',
                              marginRight: 8,
                              fontSize: 20
                            }} />
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                              Humidity
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: 1
                          }}>
                            {weatherData.humidity}%
                          </Typography>
                          <Box sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{
                              width: `${weatherData.humidity}%`,
                              height: '100%',
                              backgroundColor: '#3b82f6'
                            }} />
                          </Box>
                        </Card>
                      </Grid>

                      {/* Wind Speed */}
                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{
                          borderRadius: 2,
                          padding: 3,
                          height: '100%'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 1
                          }}>
                            <FaWind style={{
                              color: '#10b981',
                              marginRight: 8,
                              fontSize: 20
                            }} />
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                              Wind Speed
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: 1
                          }}>
                            {(weatherData.windSpeed * 3.6).toFixed(1)} km/h
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Box sx={{
                              flexGrow: 1,
                              height: 8,
                              backgroundColor: '#e2e8f0',
                              borderRadius: 4,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: `${Math.min(100, weatherData.windSpeed * 10)}%`,
                                height: '100%',
                                backgroundColor: '#10b981'
                              }} />
                            </Box>
                          </Box>
                        </Card>
                      </Grid>

                      {/* UV Index */}
                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{
                          borderRadius: 2,
                          padding: 3,
                          height: '100%'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 1
                          }}>
                            <FaSun style={{
                              color: '#f59e0b',
                              marginRight: 8,
                              fontSize: 20
                            }} />
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                              UV Index
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: 1
                          }}>
                            {weatherData.uvIndex.toFixed(1)}
                          </Typography>
                          <Box sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{
                              width: `${Math.min(100, weatherData.uvIndex * 10)}%`,
                              height: '100%',
                              backgroundColor: '#f59e0b'
                            }} />
                          </Box>
                        </Card>
                      </Grid>

                      {/* Feels Like */}
                      <Grid item xs={12} sm={6}>
                        <Card variant="outlined" sx={{
                          borderRadius: 2,
                          padding: 3,
                          height: '100%'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 1
                          }}>
                            <FaTemperatureHigh style={{
                              color: '#ef4444',
                              marginRight: 8,
                              fontSize: 20
                            }} />
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                              Feels Like
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: 1
                          }}>
                            {Math.round(weatherData.feelsLike)}°C
                          </Typography>
                          <Box sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{
                              width: `${Math.min(100, Math.max(0, weatherData.feelsLike))}%`,
                              height: '100%',
                              backgroundColor: '#ef4444'
                            }} />
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* 3-Day Forecast */}
                    <Typography variant="h5" component="h3" sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: 3
                    }}>
                      3-Day Forecast
                    </Typography>

                    <Grid container spacing={2}>
                      {forecastData.map((day, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Card sx={{
                            borderRadius: 2,
                            padding: 2,
                            textAlign: 'center',
                            backgroundColor: '#f8fafc'
                          }}>
                            <Typography variant="body1" sx={{
                              fontWeight: 'medium',
                              color: '#1e293b',
                              marginBottom: 1
                            }}>
                              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                            </Typography>
                            <img
                              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                              alt="Weather icon"
                              style={{ width: 60, height: 60, margin: '0 auto' }}
                            />
                            <Box sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 2,
                              marginTop: 1
                            }}>
                              <Box>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  High
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {Math.round(day.temp.max)}°
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  Low
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {Math.round(day.temp.min)}°
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 300
                  }}>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      No weather data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar - Right Side (Weather Reports & Other Cities) */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Weather Reports Card - More Compact */}
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: 2
              }}>
                <Typography variant="subtitle1" component="h3" sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: 1.5,
                  fontSize: '1.1rem'
                }}>
                  Weather Reports
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport || !weatherData}
                    size="small"
                    sx={{
                      backgroundColor: '#10b981',
                      '&:hover': { backgroundColor: '#059669' },
                      fontSize: '0.8rem',
                      padding: '6px 12px'
                    }}
                  >
                    {isGeneratingReport ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : 'GENERATE REPORT'}
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={handleDownloadCSV}
                    disabled={isDownloading}
                    size="small"
                    startIcon={<Download sx={{ fontSize: '1rem' }} />}
                    sx={{
                      backgroundColor: '#3b82f6',
                      '&:hover': { backgroundColor: '#2563eb' },
                      fontSize: '0.8rem',
                      padding: '6px 12px'
                    }}
                  >
                    DOWNLOAD CSV
                  </Button>
                  
                  <DownloadPDFForm data={reportData} />
                </Box>
              </Card>

              {/* Other Cities Card - More Compact */}
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: 2
              }}>
                <Typography variant="subtitle1" component="h3" sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: 1.5,
                  fontSize: '1.1rem'
                }}>
                  Other Cities
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {CITIES.filter(c => c.name !== city).map((cityItem) => (
                    <Box 
                      key={cityItem.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: 1,
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }
                      }}
                      onClick={() => fetchWeather(cityItem.lat, cityItem.lon, cityItem.name)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {cityItem.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#3b82f6',
                        fontSize: '0.8rem'
                      }}>
                        View
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WeatherDashboard;