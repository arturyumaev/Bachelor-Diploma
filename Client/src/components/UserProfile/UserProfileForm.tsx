import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import getSession from '../../utils';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import { Select } from 'antd';
import { connect } from 'react-redux';
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
  const { userProfile } = props;
  const [form] = Form.useForm();

  console.log(form.getFieldValue('birthDate'));

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
      label: 'Birth date',
      name: 'birthDate',
      placeholder: 'Input birth date',
      required: false,
      component: <>
        <DatePicker
          defaultValue={
            form.getFieldValue('birthDate') == undefined
              ? userProfile.birthDate == ''
                  ? null
                  : moment(userProfile.birthDate)
              : form.getFieldValue('birthDate')
          }
          onChange={(date, dateString) => form.setFieldsValue({ birthDate: date })}
          style={{ width: '100%' }}
        />
      </>
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
    {
      label: 'Address',
      name: 'address',
      placeholder: 'Input address',
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
      birthDate: form.getFieldValue('birthDate') == null
        ? ''
        : moment(form.getFieldValue('birthDate')).format()
    };

    fetchApi('user', HTTPMethod.PUT, values)
      .then((response) => response.json())
      .then(json => props.dispatch(updateUser(json)));
      notification.success({ message: 'Data has been updated successfully', duration: 3 });
  }

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...userProfile,
          birthDate: moment(userProfile.birthDate)
        }}
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
