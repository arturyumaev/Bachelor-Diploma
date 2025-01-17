import { Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Select, Input, Button, DatePicker, Spin } from 'antd';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Location from '../../interfaces/Location';
import { Department } from '../../interfaces/Department';

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
  departmentId: undefined,
  workExperience: undefined,
  academicDegree: '',
  notes: '',
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const { onSubmit, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!locationsRecieved) {
      fetchApi('location/-1', HTTPMethod.GET)
      .then(result => result.json())
      .then(data => setLocations(data.locations))
      .then(() => setLocationsRecieved(true));
    }

    if (!departmentsRecieved) {
      fetchApi('department/-1', HTTPMethod.GET)
      .then(result => result.json())
      .then(data => setDepartments(data.departments))
      .then(() => setDepartmentsRecieved(true));
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
      label: 'Work experience',
      name: 'workExperience',
      placeholder: 'Input work experience',
      required: true,
    },
    {
      label: 'Academic degree',
      name: 'academicDegree',
      placeholder: 'Input academic degree',
      required: true,
    },
    {
      label: 'Location',
      name: 'locationId',
      placeholder: 'Select location',
      required: true,
      component: (
        <Select
          placeholder="Select location"
          onChange={(value, option) => {
            form.setFieldsValue({ locationId: value });
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
          <FieldWrapper style={{ width: '580px' }}>
            <Form.Item name="departmentId" label="Department" rules={[{ required: true }]} key="departmentId">
              <Select
                showSearch
                placeholder="Select department"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value, option) => {
                }}
              >
                {departments.map(d => <Option value={d.id}>{d.name}</Option>)}
              </Select>
            </Form.Item>
          </FieldWrapper>
        </Wrapper>
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
        <FieldWrapper style={{ width: '580px' }}>
          <Form.Item name="notes" label="Notes" rules={[{ required: true }]} key="notes">
            <Input.TextArea />
          </Form.Item>
        </FieldWrapper>
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
