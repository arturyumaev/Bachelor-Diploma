import { Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { Select, Input, Button, notification } from 'antd';
import styled from 'styled-components';

interface IFormField {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  component?: JSX.Element;
}

const { Option } = Select;

interface IComponentProps {
  onSubmit: (data: object) => void;
  onCancel: () => void;
}

const tempPatientInitial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: null,
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const { onSubmit, onCancel } = props;
  const [form] = Form.useForm();

  const patientFormFields: Array<IFormField> = [
    {
      label: 'First name',
      name: 'firstName',
      placeholder: 'Input first name',
      required: true,
    },
    {
      label: 'Last name',
      name: 'lastName',
      placeholder: 'Input last name',
      required: true,
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'Input email',
      required: true,
    },
    {
      label: 'Phone number',
      name: 'phone',
      placeholder: 'Input phone number',
      required: true,
    },
    {
      label: 'Gender',
      name: 'gender',
      placeholder: 'Select gender',
      required: true,
      component: (
        <Select
          placeholder="Select gender"
          allowClear
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
      label: 'Birth date',
      name: 'birthDate',
      placeholder: 'Input birth date',
      required: true,
    },
    {
      label: 'Address',
      name: 'address',
      placeholder: 'Input address',
      required: false,
    },
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

  const handleFinish = () => {
    onSubmit(form.getFieldsValue());
    form.resetFields();
    notification.success({ message: 'User has been successfully created' });
  }

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  }

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={tempPatientInitial}
        onFinish={() => handleFinish()}
      >
        <Wrapper>
          {patientFormFields.map((field: IFormField) => (
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
        </Wrapper>
        <Form.Item>
          <ButtonWrapper>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button style={{ marginRight: '8px' }} onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonWrapper>
        </Form.Item>
      </Form>
    </Container>
  );
};

const Flex = styled.div`
  display: flex;
`;

const Container = styled.div`
  
`;

const Wrapper = styled(Flex)`
  flex-wrap: wrap;
`;

const ButtonWrapper = styled(Flex)`
  flex-direction: row-reverse;
`;

const FieldWrapper = styled.div`
  width: 280px;
  margin-right: 20px;
`;

