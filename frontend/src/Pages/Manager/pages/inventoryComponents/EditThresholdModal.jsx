import React, { useState } from 'react';
import { Modal, Input, Form, message, InputNumber } from 'antd';
import axios from 'axios';

const EditThresholdModal = ({ material, visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await axios.put(`/api/raw-materials/${material.id}/threshold`, {
                threshold: values.threshold
            });
            message.success('Threshold updated successfully');
            onSuccess();
            onCancel();
        } catch (error) {
            message.error('Failed to update threshold');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Set Reorder Threshold for ${material.name}`}
            visible={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form 
                form={form} 
                initialValues={{ threshold: material.threshold }}
                layout="vertical"
            >
                <Form.Item
                    name="threshold"
                    label="Reorder Threshold"
                    rules={[
                        { required: true, message: 'Please enter a threshold' },
                        { type: 'number', min: 0, message: 'Threshold must be positive' }
                    ]}
                >
                    <InputNumber 
                        style={{ width: '100%' }} 
                        min={0}
                        step={0.1}
                        addonAfter={material.unit}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditThresholdModal;