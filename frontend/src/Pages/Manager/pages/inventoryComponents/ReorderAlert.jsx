import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const ReorderAlert = () => {
  const [lowStockMaterials, setLowStockMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockMaterials = async () => {
      try {
        const response = await axios.get('/api/raw-materials/low-stock');
        setLowStockMaterials(response.data.slice(0, 1)); // Show just one alert
      } catch (error) {
        console.error('Error fetching low stock materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockMaterials();
  }, []);

  if (loading) return <div>Loading alerts...</div>;
  if (lowStockMaterials.length === 0) return null;

  const material = lowStockMaterials[0];

  return (
    <Card 
      title={
        <Text strong style={{ color: '#ff4d4f' }}>
          <ExclamationCircleOutlined /> Reorder Alert
        </Text>
      }
      variant="borderless"
      style={{ 
        marginBottom: 16,
        borderLeft: '4px solid #ff4d4f',
        backgroundColor: '#fff1f0'
      }}
    >
      <List.Item
        actions={[
          <Button 
            type="primary" 
            danger
            size="small"
            onClick={() => window.location.href=`/suppliers/${material.supplier?.id}`}
          >
            Contact Supplier
          </Button>
        ]}
      >
        <List.Item.Meta
          title={<Text strong>{material.name}</Text>}
          description={
            `Current stock: ${material.totalQuantity} ${material.unit} | ` +
            `Threshold: ${material.threshold} ${material.unit}`
          }
        />
        <Badge 
          count="Low Stock" 
          style={{ backgroundColor: '#ff4d4f' }} 
        />
      </List.Item>
    </Card>
  );
};

export default ReorderAlert;