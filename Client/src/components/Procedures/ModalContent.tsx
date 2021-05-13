import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { Select, Input, Button, DatePicker, Spin } from 'antd';
import styled from 'styled-components';
import Location from '../../interfaces/Location';
import Doctor from '../../interfaces/Doctor';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';

const { Option } = Select;

interface IComponentProps {
  onSubmit: (data: object) => void;
  onCancel: () => void;
  confirmLoading: boolean;

  doctors: Doctor[];
  locations: Location[];
}

const tempRoomInitial = {
  name: undefined,
  doctorId: undefined,
  locationId: undefined,
  roomId: undefined,
  duration: undefined,
  price: undefined,
  notes: '',
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const {
    onSubmit,
    onCancel,
    confirmLoading,
    doctors,
    locations,
  } = props;
  const [form] = Form.useForm();
  const [locationSelected, setLocationSelected] = useState<boolean>(false);
  const [locationUpdated, setLocationUpdated] = useState<boolean>(false);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsFetched, setRoomsFetched] = useState<boolean>(false);

  useEffect(() => {
    if (locationSelected && !roomsFetched) {
      fetchApi('room/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setRooms(data.rooms))
        .then(() => setRoomsFetched(true));
    }
  }, [locationSelected]);

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
        <Form.Item name="name" label="Name" rules={[{ required: true }]} key="name">
          <Input placeholder="Input procedure name" />
        </Form.Item>
        
        <Wrapper>
          <FieldWrapper>
            <Form.Item name="doctorId" label="Doctor" rules={[{ required: true }]} key="doctorId">
              <Select
                showSearch
                placeholder="Select doctor"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value, option) => {
                  const currentDoctor = _.find(doctors, d => d.id == value);
                  const doctorLocation = _.find(locations, l => l.id == currentDoctor?.locationId);
                  form.setFieldsValue({ locationId: doctorLocation?.id });
                  setLocationSelected(true);
                  setLocationUpdated(!locationUpdated);
                }}
              >
                {doctors.map(d => <Option value={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)}
              </Select>
            </Form.Item>
          </FieldWrapper>
          <FieldWrapper>
            <Form.Item name="locationId" label="Location (depends on doctor)"  key="locationId">
              <Select disabled placeholder="Select doctor">
                {locations.map(l => <Option value={l.id}>{l.locationName}</Option>)}
              </Select>
            </Form.Item>
          </FieldWrapper>
        </Wrapper>
        <Wrapper>
          <FieldWrapper>
            <Form.Item name="roomId" label="Room (depends on location)" key="roomId">
              <Select disabled={!locationSelected} placeholder="Select room">
                {rooms[0] &&
                  rooms
                    .filter(r => r.locationId == form.getFieldValue('locationId'))
                    .map(r => <Option value={r.id}>{r.name}</Option>)
                }
              </Select>
            </Form.Item>
          </FieldWrapper>
        </Wrapper>
        <Wrapper>
          <FieldWrapper>
            <Form.Item name="price" label="Price" rules={[{ required: true }]} key="price">
              <Input type="number" prefix="₽" suffix="RUB" />
            </Form.Item>
          </FieldWrapper>
          <FieldWrapper>
            <Form.Item name="duration" label="Duration" rules={[{ required: true }]} key="duraion">
              <Input type="number" suffix="Min" />
            </Form.Item>
          </FieldWrapper>
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
