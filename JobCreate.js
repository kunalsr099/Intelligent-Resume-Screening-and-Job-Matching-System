import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message,
  InputNumber,
  Select,
  Space
} from 'antd';
import { 
  BriefcaseOutlined, 
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JobCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post('/api/jobs', values);
      message.success('Job created successfully!');
      navigate('/jobs');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'RECRUITER' && user?.role !== 'ADMIN') {
    return (
      <Layout>
        <Content style={{ padding: '24px' }}>
          <Card>
            <Title level={3}>Access Denied</Title>
            <p>Only recruiters can create job postings.</p>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Card 
          title="Create Job Posting" 
          style={{ maxWidth: 800, margin: '0 auto' }}
          extra={
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/jobs')}
            >
              Back to Jobs
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 'ACTIVE',
              jobType: 'Full-time'
            }}
          >
            <Form.Item
              name="title"
              label="Job Title"
              rules={[{ required: true, message: 'Please enter job title' }]}
            >
              <Input placeholder="e.g., Senior Software Engineer" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please enter department' }]}
            >
              <Input placeholder="e.g., Engineering" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input placeholder="e.g., New York, NY or Remote" />
            </Form.Item>

            <Form.Item
              name="jobType"
              label="Job Type"
              rules={[{ required: true, message: 'Please select job type' }]}
            >
              <Select placeholder="Select job type">
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Internship">Internship</Option>
                <Option value="Remote">Remote</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Job Description"
              rules={[{ required: true, message: 'Please enter job description' }]}
            >
              <TextArea
                rows={6}
                placeholder="Provide a detailed description of the role, responsibilities, and what the candidate will be doing..."
              />
            </Form.Item>

            <Form.Item
              name="requirements"
              label="Requirements"
              rules={[{ required: true, message: 'Please enter job requirements' }]}
            >
              <TextArea
                rows={4}
                placeholder="List the required qualifications, experience, education, etc..."
              />
            </Form.Item>

            <Form.Item
              name="skills"
              label="Required Skills"
              rules={[{ required: true, message: 'Please enter required skills' }]}
            >
              <TextArea
                rows={3}
                placeholder="List the technical and soft skills required for this position (comma separated)..."
              />
            </Form.Item>

            <Form.Item label="Salary Range">
              <Input.Group compact>
                <Form.Item
                  name="minSalary"
                  noStyle
                  rules={[{ type: 'number', min: 0, message: 'Please enter valid minimum salary' }]}
                >
                  <InputNumber
                    style={{ width: '45%' }}
                    placeholder="Min Salary"
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Input
                  style={{
                    width: '10%',
                    textAlign: 'center',
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none'
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item
                  name="maxSalary"
                  noStyle
                  rules={[{ type: 'number', min: 0, message: 'Please enter valid maximum salary' }]}
                >
                  <InputNumber
                    style={{ width: '45%' }}
                    placeholder="Max Salary"
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Create Job
                </Button>
                <Button onClick={() => navigate('/jobs')}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default JobCreate;
