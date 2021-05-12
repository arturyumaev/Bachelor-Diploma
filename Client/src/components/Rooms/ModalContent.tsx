import { Form } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Select, Input, Button, DatePicker, Spin } from 'antd';
import styled from 'styled-components';
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
  locations: Location[];
  onSubmit: (data: object) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}

const tempRoomInitial = {
  name: '',
  floor: undefined,
  notes: '',
  locationId: 1,
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const { locations, onSubmit, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();

  const roomFormFields: Array<IFormField> = [
    {
      label: 'Name',
      name: 'name',
      placeholder: 'Input room name',
      required: true,
    },
    {
      label: 'Floor',
      name: 'floor',
      placeholder: 'Input floor',
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
  ];

  const handleFinish = () => {
    const dataToSubmit = form.getFieldsValue();
    onSubmit(dataToSubmit);
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
        initialValues={tempRoomInitial}
        onFinish={() => handleFinish()}
      >
        <Wrapper>
          {roomFormFields.map((field: IFormField) => (
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
        <Form.Item name="notes" label="Notes" required={false} key="notes">
          <Input.TextArea />
        </Form.Item>
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
