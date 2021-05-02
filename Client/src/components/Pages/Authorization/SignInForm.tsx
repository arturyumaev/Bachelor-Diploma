import React, { useContext } from 'react';
import { Input } from 'antd';
import { Form, Button, Radio } from 'antd';
import { connect } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { fetchApi, HTTPMethod } from '../../../api/Api';
import { GlobalContext } from '../../../App';
import updateUser from '../../../store/actionCreators/userProfile/updateUser';
import { ICommonUser } from '../../../store/reducers/userProfileReducer';

interface FormValues {
  login: string;
  password: string;
}

const requestEntity: string = 'auth';

const SignInForm = (props: any) => {
  const globalContext = useContext(GlobalContext);

  console.log('props', props.userProfile);

  const onSubmit = (values: FormValues) => {
    fetchApi(requestEntity, HTTPMethod.POST, values)
      .then((response) => response.json())
      .then((json: ICommonUser) => {
        alert(JSON.stringify(json));
        props.dispatch(updateUser(json));
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

const mapStateToProps = function(state: any) {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(mapStateToProps)(SignInForm);
