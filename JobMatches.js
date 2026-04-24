import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Progress,
  Select,
  Row,
  Col
} from 'antd';
import { 
  TeamOutlined, 
  EyeOutlined, 
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const JobMatches = () => {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, [jobId, statusFilter]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/matches/job/${jobId}?status=${statusFilter}`);
      setMatches(response.data);
    } catch (error) {
      message.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (match) => {
    setSelectedMatch(match);
    setDetailModalVisible(true);
  };

  const handleStatusUpdate = async (matchId, newStatus) => {
    try {
      await api.put(`/api/matches/${matchId}/status?status=${newStatus}`);
      message.success(`Match status updated to ${newStatus}`);
      fetchMatches();
    } catch (error) {
      message.error('Failed to update match status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'orange',
      REVIEWED: 'blue',
      SHORTLISTED: 'green',
      REJECTED: 'red',
      HIRED: 'purple'
    };
    return colors[status] || 'default';
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#52c41a';
    if (score >= 0.6) return '#fa8c16';
    return '#ff4d4f';
  };

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_, record) => (
        <Space>
          <UserOutlined />
          <span>{record.resume.user.firstName} {record.resume.user.lastName}</span>
        </Space>
      ),
    },
    {
      title: 'Resume Title',
      dataIndex: ['resume', 'title'],
      key: 'resumeTitle',
    },
    {
      title: 'Match Score',
      dataIndex: 'matchScore',
      key: 'matchScore',
      render: (score) => (
        <div>
          <Progress
            percent={Math.round(score * 100)}
            size="small"
            strokeColor={getScoreColor(score)}
            format={() => `${Math.round(score * 100)}%`}
          />
        </div>
      ),
      sorter: (a, b) => a.matchScore - b.matchScore,
      defaultSortOrder: 'descend',
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
      title: 'Matched At',
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
            View Details
          </Button>
          {user?.role === 'RECRUITER' && record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'SHORTLISTED')}
                style={{ color: '#52c41a' }}
              >
                Shortlist
              </Button>
              <Button 
                type="link" 
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'REJECTED')}
              >
                Reject
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
          title="Job Matches" 
          extra={
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/jobs')}
            >
              Back to Jobs
            </Button>
          }
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                placeholder="Filter by status"
              >
                <Option value="PENDING">Pending</Option>
                <Option value="REVIEWED">Reviewed</Option>
                <Option value="SHORTLISTED">Shortlisted</Option>
                <Option value="REJECTED">Rejected</Option>
                <Option value="HIRED">Hired</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12}>
              <div style={{ textAlign: 'right', lineHeight: '32px' }}>
                <Tag color="blue">Total Matches: {matches.length}</Tag>
              </div>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={matches}
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
          title="Match Details"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={900}
        >
          {selectedMatch && (
            <div>
              <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Candidate" span={2}>
                  {selectedMatch.resume.user.firstName} {selectedMatch.resume.user.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Resume Title">
                  {selectedMatch.resume.title}
                </Descriptions.Item>
                <Descriptions.Item label="Match Score">
                  <Progress
                    percent={Math.round(selectedMatch.matchScore * 100)}
                    strokeColor={getScoreColor(selectedMatch.matchScore)}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedMatch.status)}>
                    {selectedMatch.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Matched At">
                  {new Date(selectedMatch.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Card title="Match Analysis" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card size="small" title="Skills Match">
                      <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {selectedMatch.skillMatchAnalysis}
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Experience Match">
                      <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {selectedMatch.experienceMatchAnalysis}
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Education Match">
                      <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {selectedMatch.educationMatchAnalysis}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>

              <Card title="Resume Content" size="small">
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {selectedMatch.resume.content}
                  </pre>
                </div>
              </Card>

              {user?.role === 'RECRUITER' && selectedMatch.status === 'PENDING' && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Space>
                    <Button 
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        handleStatusUpdate(selectedMatch.id, 'SHORTLISTED');
                        setDetailModalVisible(false);
                      }}
                    >
                      Shortlist Candidate
                    </Button>
                    <Button 
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => {
                        handleStatusUpdate(selectedMatch.id, 'REJECTED');
                        setDetailModalVisible(false);
                      }}
                    >
                      Reject Candidate
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default JobMatches;
