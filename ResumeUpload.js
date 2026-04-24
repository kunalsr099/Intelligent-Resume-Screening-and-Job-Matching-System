import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Upload, 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  message, 
  Progress,
  Space
} from 'antd';
import { 
  UploadOutlined, 
  FileTextOutlined,
  InboxOutlined 
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const ResumeUpload = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpload = async (values) => {
    const { file, title } = values;
    
    if (!file || !file.fileList || file.fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file.fileList[0].originFileObj);
    formData.append('title', title);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      message.success('Resume uploaded successfully!');
      form.resetFields();
      setUploadProgress(0);
      
      // Process the resume
      await api.post(`/api/resumes/${response.data.id}/process`);
      message.success('Resume processed successfully!');
      
      navigate('/resumes');
    } catch (error) {
      message.error(error.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.doc,.docx,.txt',
    beforeUpload: (file) => {
      const isValidType = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'].includes(file.type);
      
      if (!isValidType) {
        message.error('You can only upload PDF, DOC, DOCX, or TXT files!');
        return false;
      }
      
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      
      return false; // Prevent automatic upload
    },
    onChange(info) {
      // Handle file change
    },
  };

  if (user?.role !== 'CANDIDATE') {
    return (
      <Layout>
        <Content style={{ padding: '24px' }}>
          <Card>
            <Title level={3}>Access Denied</Title>
            <Text>Only candidates can upload resumes.</Text>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Card title="Upload Resume" style={{ maxWidth: 800, margin: '0 auto' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
          >
            <Form.Item
              name="title"
              label="Resume Title"
              rules={[{ required: true, message: 'Please enter a title for your resume' }]}
            >
              <Input placeholder="e.g., Software Engineer Resume" />
            </Form.Item>

            <Form.Item
              name="file"
              label="Resume File"
              rules={[{ required: true, message: 'Please upload your resume file' }]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for PDF, DOC, DOCX, or TXT files. Maximum file size: 10MB.
                </p>
              </Dragger>
            </Form.Item>

            {uploading && (
              <Form.Item>
                <Progress 
                  percent={uploadProgress} 
                  status={uploadProgress === 100 ? 'success' : 'active'}
                  format={(percent) => `${percent}%`}
                />
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={uploading}
                  icon={<UploadOutlined />}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
                <Button onClick={() => navigate('/resumes')}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
            <Title level={5}>
              <FileTextOutlined /> Supported File Formats
            </Title>
            <ul style={{ paddingLeft: '20px' }}>
              <li>PDF (.pdf)</li>
              <li>Microsoft Word (.doc, .docx)</li>
              <li>Plain Text (.txt)</li>
            </ul>
            <Text type="secondary">
              After upload, your resume will be automatically processed to extract skills, experience, and education information.
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ResumeUpload;
