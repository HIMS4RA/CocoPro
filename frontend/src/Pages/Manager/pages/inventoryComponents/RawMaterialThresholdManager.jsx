import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Card, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const RawMaterialThresholdManager = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/raw-materials');
            // Ensure data is an array and has the required properties
            const validMaterials = Array.isArray(response.data) 
                ? response.data.map(item => ({
                    ...item,
                    key: item.id, // Add key prop for Table
                    createdAt: item.createdAt || new Date().toISOString()
                }))
                : [];
            setMaterials(validMaterials);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Material',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Text strong={record.totalQuantity < record.threshold}>
                    {text}
                </Text>
            ),
        },
        {
            title: 'Current Stock',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            render: (value, record) => (
                <Text type={value < record.threshold ? 'danger' : 'success'}>
                    {value} {record.unit}
                </Text>
            ),
        },
        {
            title: 'Reorder Threshold',
            dataIndex: 'threshold',
            key: 'threshold',
            render: (value, record) => `${value} ${record.unit}`,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                record.totalQuantity < record.threshold ? (
                    <Tag icon={<ExclamationCircleOutlined />} color="error">
                        Reorder Needed
                    </Tag>
                ) : (
                    <Tag color="success">Stock OK</Tag>
                )
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    size="small"
                    onClick={() => {
                        setEditingMaterial(record);
                        setModalVisible(true);
                    }}
                >
                    Edit Threshold
                </Button>
            ),
        },
    ];

    return (
        <Card title="Raw Material Threshold Management" variant="borderless">
            <Table 
                columns={columns} 
                dataSource={materials}
                loading={loading}
                pagination={{ pageSize: 10 }}
                size="middle"
                locale={{
                    emptyText: 'No materials found'
                }}
            />
            
            {/* Your EditThresholdModal component here */}
        </Card>
    );
};

export default RawMaterialThresholdManager;