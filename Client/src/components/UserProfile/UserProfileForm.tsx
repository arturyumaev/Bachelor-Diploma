import React, { useState } from 'react';
import styled from 'styled-components';
import getSession from '../../utils';
import { Form, Input, Button } from 'antd';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { fetchApi, HTTPMethod } from '../../api/Api';
import updateUser from '../../store/actionCreators/userProfile/updateUser';

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

  const PatientFields: Array<IFormField> = [
    {
      label: 'Emergency contact name',
      name: 'emergencyContactName',
      placeholder: 'Input name',
      required: false,
    },
    {
      label: 'Emergency contact phone',
      name: 'emergencyContactPhone',
      placeholder: 'Input phone',
      required: false,
    },
    {
      label: 'Emergency contact relation',
      name: 'emergencyContactRelation',
      placeholder: 'Input relation',
      required: false,
    },
  ];

  const handleOnFinish = () => {
    const values = {
      ...form.getFieldsValue(),
      id: props.userProfile.id,
      accessControl: props.userProfile.accessControl,
    };

    fetchApi('user', HTTPMethod.PUT, values)
      .then((response) => response.json())
      .then(json => props.dispatch(updateUser(json)));
  }

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={userProfile}
        onFinish={handleOnFinish}
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
          {props.userProfile.accessControl === 'Patient' &&
            PatientFields.map((field: IFormField) => (
              <FieldWrapper key={field.name}>
                <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                  <Input placeholder={field.placeholder}/>
                </Form.Item>
              </FieldWrapper>
              )
            )
          }
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
