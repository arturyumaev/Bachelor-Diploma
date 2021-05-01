import React, { useContext } from 'react';
import { Input } from 'antd';
import { Form, Button, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { fetchApi, HTTPMethod } from '../../../api/Api';
import { GlobalContext } from '../../../App';

interface FormValues {
  login: string;
  password: string;
}

const requestEntity: string = 'auth';

const SignInForm = () => {
  const globalContext = useContext(GlobalContext);

  const onSubmit = (values: FormValues) => {
    console.log(values);

    fetchApi(requestEntity, HTTPMethod.POST, values)
      .then((response) => response.json())
      .then((json) => {
        alert(JSON.stringify(json));
        globalContext.sessionUpdated();
      })
      .catch((err) => {
        alert(err);
      })
  }

  return (
    <div>
      <div className="center-hor">
        <h5>Authorization</h5>
      </div>

      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
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