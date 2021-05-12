import { Form } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Select, Input, Button, DatePicker, Spin } from 'antd';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Location from '../../interfaces/Location';

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
  confirmLoading: boolean;
}

const tempDoctorInitial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: null,
  address: '',
  locationId: 1,
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const { onSubmit, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!locationsRecieved) {
      fetchApi('location/-1', HTTPMethod.GET)
      .then(result => result.json())
      .then(data => setLocations(data.locations))
      .then(() => setLocationsRecieved(true));
    }
  });

  const doctorFormFields: Array<IFormField> = [
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
      component: (
        <DatePicker
          style={{ width: '100%' }}
          onChange={(date, _) => form.setFieldsValue({ birthDate: date })}
        />
      )
    },
    {
      label: 'Location',
      name: 'locationId',
      placeholder: 'Select location',
      required: true,
      component: (
        <Select
          // value={1}
          placeholder="Select location"
          onChange={(value, option) => {
            console.log({ value, option });
            // form.setFieldsValue({ gender: nextValue });
          }}
        >
          {locations.map(l => <Option value={l.id}>{l.locationName}</Option>)}
        </Select>
      ),
    },
    {
      label: 'Address',
      name: 'address',
      placeholder: 'Input address',
      required: false,
    },
  ];

  const handleFinish = () => {
    const dataToSubmit = form.getFieldsValue();
    onSubmit({
      ...dataToSubmit,
      birthDate: moment(dataToSubmit.birthDate).format(),
    });
    form.resetFields();
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
        initialValues={tempDoctorInitial}
        onFinish={() => handleFinish()}
      >
        <Wrapper>
          {doctorFormFields.map((field: IFormField) => (
            <FieldWrapper key={field.name}>
              <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                {field.component
                  ? field.component
                  : <Input disabled={confirmLoading} placeholder={field.placeholder}/>
                }
              </Form.Item>
            </FieldWrapper>
            )
          )}
        </Wrapper>
        <Form.Item>
          <ButtonWrapper>
            <Button disabled={confirmLoading} type="primary" htmlType="submit">
              {confirmLoading
                ? <><Spin />&nbsp;Loading...</>
                : <>Create</>
              }
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

const Container = styled.div``;

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
