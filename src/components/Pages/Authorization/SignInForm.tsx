import React from 'react';
import { Input } from 'antd';
import { Form, Button, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const SignInForm = () => {
  const [form] = Form.useForm();

  return (
    <div>
      <div className="center-hor">
        <h5>Authorization</h5>
      </div>

      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={() => {}}
      >
        <Form.Item name="username" rules={[{ required: true, message: 'Please input username!' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please input password!' }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <div className="pull right">
            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SignInForm
