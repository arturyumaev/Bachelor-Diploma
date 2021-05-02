import React, { useState } from 'react';
import styled from 'styled-components';
import getSession from '../../utils';
import { Form, Input, Button } from 'antd';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { ICommonUser } from '../../store/reducers/userProfileReducer';

const { Option } = Select;

interface IFormField {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  component?: JSX.Element;
}

const UserProfileForm = (props: any) => {
  const session = getSession();
  const [form] = Form.useForm();
  const { userProfile } = props;

  const BaseFormFields: Array<IFormField> = [
    {
      label: 'First name',
      name: 'firstName',
      placeholder: 'Input first name',
      required: false,
    },
    {
      label: 'Last name',
      name: 'lastName',
      placeholder: 'Input last name',
      required: false,
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'Input email',
      required: false,
    },
    {
      label: 'Phone number',
      name: 'phone',
      placeholder: 'Input phone number',
      required: false,
    },
    {
      label: 'Gender',
      name: 'gender',
      placeholder: 'Select gender',
      required: false,
      component: (
        <Select
          value={userProfile.gender}
          onChange={(nextValue: string) => {
            form.setFieldsValue({ gender: nextValue });
          }}
        >
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Other">Other</Option>
        </Select>
      ),
    },
    {
      label: 'Address',
      name: 'address',
      placeholder: 'Input address',
      required: false,
    },
    {
      label: 'Username',
      name: 'username',
      placeholder: 'Input username',
      required: false,
    },
    {
      label: 'Password',
      name: 'hashsum',
      placeholder: 'Input password',
      required: false,
    },
  ];

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={userProfile}
        onFinish={() => console.log(form.getFieldsValue())}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {BaseFormFields.map((field: IFormField) => (
            <FieldWrapper key={field.name}>
              <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                {field.component
                  ? field.component
                  : <Input placeholder={field.placeholder}/>
                }
              </Form.Item>
            </FieldWrapper>
            )
          )}
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  max-width: 770px;
`;

const FieldWrapper = styled.div`
  width: 350px;
  margin-right: 20px;
`;

const mapStateToProps = function(state: any) {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps
)(UserProfileForm);
