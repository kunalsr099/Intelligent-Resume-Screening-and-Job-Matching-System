import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Row, Col, Typography, Statistic, Avatar, Dropdown, Tag } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  LaptopOutlined, 
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    totalMatches: 0,
    pendingMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Commented out stats fetch for now - endpoint doesn't exist in backend
    // fetchStats();
    fetchResumes();
    setLoading(false);
  }, []);

  const fetchResumes = async () => {
    try {
      const endpoint = user?.role === 'CANDIDATE' ? '/api/resumes/my' : '/api/resumes';
      const response = await api.get(endpoint);
      setResumes(response.data);
      setStats(prev => ({
        ...prev,
        totalResumes: response.data.length
      }));
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'resumes',
      icon: <FileTextOutlined />,
      label: 'Resumes',
      onClick: () => navigate('/resumes'),
    },
    {
      key: 'jobs',
      icon: <LaptopOutlined />,
      label: 'Jobs',
      onClick: () => navigate('/jobs'),
    },
    {
      key: 'matches',
      icon: <TeamOutlined />,
      label: 'Matches',
      onClick: () => navigate('/matches'),
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="dashboard-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#001529',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'RSS' : 'Resume Screening'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Title level={4} style={{ margin: 0, color: '#333' }}>
              Welcome, {user?.username}!
            </Title>
          </div>
          
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="text" icon={<Avatar icon={<UserOutlined />} />}>
              {user?.username}
            </Button>
          </Dropdown>
        </Header>
        
        <Content className="dashboard-content">
          <Title level={2}>Dashboard Overview</Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Resumes"
                  value={stats.totalResumes}
                  prefix={<FileTextOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Jobs"
                  value={stats.totalJobs}
                  prefix={<LaptopOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Matches"
                  value={stats.totalMatches}
                  prefix={<TeamOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending Matches"
                  value={stats.pendingMatches}
                  prefix={<TeamOutlined />}
                  loading={loading}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Quick Actions" size="small">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {user?.role === 'CANDIDATE' && (
                    <Button type="primary" block onClick={() => navigate('/resumes/upload')}>
                      Upload Resume
                    </Button>
                  )}
                  {user?.role === 'RECRUITER' && (
                    <Button type="primary" block onClick={() => navigate('/jobs/create')}>
                      Create Job Posting
                    </Button>
                  )}
                  <Button block onClick={() => navigate('/jobs')}>
                    Browse Jobs
                  </Button>
                  <Button block onClick={() => navigate('/resumes')}>
                    View All Resumes
                  </Button>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="Recent Activity" size="small">
                <div style={{ textAlign: 'center', color: '#999' }}>
                  No recent activity to display
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="My Resumes" extra={<Button type="link" onClick={() => navigate('/resumes')}>View All</Button>}>
                {resumes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
                    No resumes uploaded yet. {user?.role === 'CANDIDATE' && 'Click "Upload Resume" to get started.'}
                  </div>
                ) : (
                  resumes.slice(0, 5).map(resume => (
                    <div key={resume.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{resume.title}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            {resume.fileName} • {new Date(resume.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Tag color={resume.status === 'UPLOADED' ? 'orange' : resume.status === 'PROCESSED' ? 'blue' : 'default'}>
                          {resume.status}
                        </Tag>
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
