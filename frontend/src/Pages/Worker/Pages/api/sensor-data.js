// pages/api/sensor-data.js
import { query } from '../../lib/db'

export default async function handler(req, res) {
  const { metric } = req.query
  
  try {
    let results
    if (metric === 'rpm') {
      results = await query(
        'SELECT id, rpm, timestamp FROM cocopro.sensor_data ORDER BY timestamp DESC LIMIT 100'
      )
    } else {
      results = await query(
        'SELECT * FROM cocopro.sensor_data ORDER BY timestamp DESC LIMIT 100'
      )
    }
    
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}