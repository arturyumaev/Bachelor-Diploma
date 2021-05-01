import React, { useState } from 'react';
import styled from 'styled-components';
import getSession from '../../../utils';
import { Form, Input, Button, Radio } from 'antd';

interface IFormField {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;

}

type RequiredMark = boolean | 'optional';

const UserProfileForm = () => {
  const session = getSession();
  
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional');

  const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  /*
  "firstName" varchar(50)
  "lastName" varchar(50) not null ,
  email varchar(50) not null ,
  phone varchar(50) not null ,
  gender "Gender" not null ,
  "birthDate" timestamp not null ,
  address varchar(300) not null ,
  username varchar(50) not null ,
  hashsum varchar(50) not null ,
  */

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
  ];

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {BaseFormFields.map((field: IFormField) => (
            <FieldWrapper>
              <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]}>
                <Input placeholder={field.placeholder} />
              </Form.Item>
            </FieldWrapper>
            )
          )}
        </div>
        <Form.Item>
          <Button type="primary">Submit</Button>
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

export default UserProfileForm;