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
  Input,
  Select,
  Row,
  Col
} from 'antd';
import { 
  LaptopOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    skill: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'RECRUITER' ? '/api/jobs/my' : '/api/jobs';
      const params = new URLSearchParams();
      
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.skill) params.append('skill', filters.skill);
      
      const response = await api.get(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`);
      setJobs(response.data);
    } catch (error) {
      message.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setDetailModalVisible(true);
  };

  const handleDelete = async (jobId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this job?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/api/jobs/${jobId}`);
          message.success('Job deleted successfully');
          fetchJobs();
        } catch (error) {
          message.error('Failed to delete job');
        }
      },
    });
  };

  const handleFindMatches = async (jobId) => {
    try {
      await api.post(`/api/jobs/${jobId}/match`);
      message.success('Matching process started successfully');
      navigate(`/jobs/${jobId}/matches`);
    } catch (error) {
      message.error('Failed to start matching process');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'green',
      INACTIVE: 'default',
      CLOSED: 'red',
      DRAFT: 'orange'
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
          <LaptopOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Space>
          <EnvironmentOutlined />
          <span>{location}</span>
        </Space>
      ),
    },
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: 'Salary Range',
      key: 'salary',
      render: (_, record) => (
        <Space>
          <DollarOutlined />
          <span>
            {record.minSalary && record.maxSalary 
              ? `$${record.minSalary.toLocaleString()} - $${record.maxSalary.toLocaleString()}`
              : record.minSalary 
                ? `From $${record.minSalary.toLocaleString()}`
                : 'Not specified'
            }
          </span>
        </Space>
      ),
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
          {user?.role === 'RECRUITER' && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/jobs/${record.id}/edit`)}
              >
                Edit
              </Button>
              <Button 
                type="link" 
                icon={<SearchOutlined />}
                onClick={() => handleFindMatches(record.id)}
              >
                Find Matches
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
          title="Job Postings" 
          extra={
            user?.role === 'RECRUITER' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/jobs/create')}
              >
                Create Job
              </Button>
            )
          }
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Search
                placeholder="Search by location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                onSearch={() => fetchJobs()}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Filter by job type"
                value={filters.jobType}
                onChange={(value) => setFilters({...filters, jobType: value})}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Internship">Internship</Option>
                <Option value="Remote">Remote</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Search
                placeholder="Search by skills"
                value={filters.skill}
                onChange={(e) => setFilters({...filters, skill: e.target.value})}
                onSearch={() => fetchJobs()}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={jobs}
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
          title="Job Details"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedJob && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Title" span={2}>
                {selectedJob.title}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedJob.department}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedJob.location}
              </Descriptions.Item>
              <Descriptions.Item label="Job Type">
                <Tag>{selectedJob.jobType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedJob.status)}>
                  {selectedJob.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Salary Range">
                {selectedJob.minSalary && selectedJob.maxSalary 
                  ? `$${selectedJob.minSalary.toLocaleString()} - $${selectedJob.maxSalary.toLocaleString()}`
                  : selectedJob.minSalary 
                    ? `From $${selectedJob.minSalary.toLocaleString()}`
                    : 'Not specified'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {selectedJob.description}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Requirements" span={2}>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {selectedJob.requirements}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Required Skills" span={2}>
                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  {selectedJob.skills}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedJob.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default JobList;
