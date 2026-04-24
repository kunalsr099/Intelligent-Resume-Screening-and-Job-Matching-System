import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Table, 
  Button, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  message,
  Modal,
  Descriptions,
  Input
} from 'antd';
import { 
  FileTextOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'CANDIDATE' ? '/api/resumes/my' : '/api/resumes';
      const response = await api.get(endpoint);
      setResumes(response.data);
    } catch (error) {
      message.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (resume) => {
    setSelectedResume(resume);
    setDetailModalVisible(true);
  };

  const handleDelete = async (resumeId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this resume?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/api/resumes/${resumeId}`);
          message.success('Resume deleted successfully');
          fetchResumes();
        } catch (error) {
          message.error('Failed to delete resume');
        }
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      UPLOADED: 'orange',
      PROCESSED: 'blue',
      ACTIVE: 'green',
      INACTIVE: 'default'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'File Type',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (type) => type?.split('/')[1]?.toUpperCase() || 'Unknown',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {user?.role === 'CANDIDATE' && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/resumes/${record.id}/edit`)}
              >
                Edit
              </Button>
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Card 
          title="Resumes" 
          extra={
            user?.role === 'CANDIDATE' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/resumes/upload')}
              >
                Upload Resume
              </Button>
            )
          }
        >
          <Table
            columns={columns}
            dataSource={resumes}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>

        <Modal
          title="Resume Details"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedResume && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Title" span={2}>
                {selectedResume.title}
              </Descriptions.Item>
              <Descriptions.Item label="File Name">
                {selectedResume.fileName}
              </Descriptions.Item>
              <Descriptions.Item label="File Type">
                {selectedResume.fileType}
              </Descriptions.Item>
              <Descriptions.Item label="File Size">
                {(selectedResume.fileSize / 1024 / 1024).toFixed(2)} MB
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedResume.status)}>
                  {selectedResume.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedResume.createdAt).toLocaleString()}
              </Descriptions.Item>
              {selectedResume.extractedSkills && (
                <Descriptions.Item label="Extracted Skills" span={2}>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {selectedResume.extractedSkills}
                  </div>
                </Descriptions.Item>
              )}
              {selectedResume.extractedExperience && (
                <Descriptions.Item label="Extracted Experience" span={2}>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {selectedResume.extractedExperience}
                  </div>
                </Descriptions.Item>
              )}
              {selectedResume.extractedEducation && (
                <Descriptions.Item label="Extracted Education" span={2}>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {selectedResume.extractedEducation}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default ResumeList;
