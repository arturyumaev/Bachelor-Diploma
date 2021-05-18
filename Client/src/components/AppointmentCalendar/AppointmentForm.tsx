import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import moment from 'moment';
import { Select, Form, DatePicker, TimePicker, Input } from 'antd';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import Doctor from '../../interfaces/Doctor';
import { convertMinsToHrsMins } from './AppointmentCalendar';
import Location from '../../interfaces/Location';
import Patient from '../../interfaces/Patient';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';
import { CalendarEvent } from './AppointmentCalendar';

const { TextArea } = Input;
const { Option } = Select;

export interface IAppointmentData {
  doctorId: number;
  procedureId: number;
  departmentId: number;
  from: Date;
  to: Date;
};

type IComponentProps = IAppointmentData & {
  procedures: AppointmentProcedure[];
  doctors: Doctor[];
  departments: Department[];
  locations: Location[];
  onSubmit: (values: any) => void;

  readonly: boolean;
  appointment?: CalendarEvent;
};

export const AppointmentForm: React.FC<IComponentProps> = props => {
  const {
    doctors, 
    procedures,
    departments,
    locations,
    doctorId,
    procedureId,
    departmentId,
    from,
    to,
    onSubmit,
    readonly,
    appointment,
  } = props;
  const [form] = Form.useForm();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsRecieved, setPatientsRecieved] = useState<boolean>(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsRecieved, setRoomsRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!patientsRecieved) {
      fetchApi('user/patient/-1', HTTPMethod.GET)
        .then((result) => { setPatientsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setPatients(data.patients));
    }

    if (!roomsRecieved) {
      fetchApi('room/-1', HTTPMethod.GET)
        .then((result) => { setRoomsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setRooms(data.rooms));
    }
  }, [patientsRecieved, roomsRecieved]);

  return (
    <Container>
      <Form
        id="appointmentForm"
        form={form}
        layout="vertical"
        initialValues={{
          patientId: readonly ? appointment?.patientId : undefined,
          roomId: readonly ? appointment?.roomId : undefined,
          appointmentProcedureId: readonly ? appointment?.procedureId : procedureId,
          doctorId: readonly ? appointment?.doctorId : doctorId,
          departmentId: readonly
            ? doctors.find(doc => doc.id == appointment?.doctorId)?.departmentId
            : departmentId,
          date: readonly ? moment(appointment?.start) : moment(from),
          scheduledTime: readonly ? moment(appointment?.start) : moment(from),
          scheduledEndTime: readonly ? moment(appointment?.end) : moment(to),
          duration: readonly
            ? convertMinsToHrsMins(procedures.find(p => p.id == appointment?.procedureId)?.duration)
            : convertMinsToHrsMins(procedures.find(p => p.id == procedureId)?.duration),
          locationId: readonly ? doctors.find(d => d.id == appointment?.doctorId)?.locationId : doctors.find(d => d.id == doctorId)?.locationId,
          notes: readonly ? appointment?.notes : '',
        }}
        onFinish={(values) => {
          const result: any = {};
          ['roomId', 'doctorId', 'notes', 'patientId', 'appointmentProcedureId'].map(k => {
            result[k] = values[k]
          });

          result['scheduledTime'] = values['scheduledTime'].format();
          result['scheduledEndTime'] = values['scheduledEndTime'].format();

          onSubmit(result);
        }
        }
      >
        <StyledSelects>
          <SelectContainer>
            <Form.Item label="Patient" rules={[{ required: true }]} name="patientId">
              <Select
                disabled={readonly}
                showSearch
                style={{ width: '100%' }}
                placeholder="Select patient"
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {patients.map(p => (
                  <Option key={p.id} value={p.id}>
                    {`${p.firstName} ${p.lastName} ${dayjs(p.birthDate).format('DD/MM/YYYY')}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </SelectContainer>
          <SelectContainer>
            <Form.Item label="Procedure" name="appointmentProcedureId">
              <Select
                disabled
                style={{ width: '100%' }}
                optionFilterProp="children"
              >
                {procedures.map(p => <Option value={p.id} key={p.id}>{p.name}</Option>)}
              </Select>
            </Form.Item>
          </SelectContainer>
          <SelectContainer wrap="true">
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Doctor" name="doctorId">
                <Select
                  disabled
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                >
                  {doctors.map(d => <Option value={d.id} key={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Department" name="departmentId">
                <Select
                  disabled
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                >
                  {departments.map(d => <Option value={d.id} key={d.id}>{d.name}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer wrap="true">
            <SelectWrapper widthPercent={25}>
              <Form.Item label="Date" name="date">
                <DatePicker disabled/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="From" name="scheduledTime">
                <TimePicker disabled format={'HH:mm'}/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="To" name="scheduledEndTime">
                <TimePicker disabled format={'HH:mm'}/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="Duration" name="duration">
                <Input disabled placeholder="Basic usage"/>
              </Form.Item>
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer wrap="true">
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Location" name="locationId">
                <Select
                  disabled
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                >
                  {locations.map(l => <Option value={l.id} key={l.id}>{l.locationName}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Room" name="roomId" rules={[{ required: true }]}>
                <Select
                  disabled={readonly}
                  showSearch
                  placeholder="Select room"
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {rooms.map(r => <Option value={r.id} key={r.id}>{r.name}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer>
            <Form.Item label="Notes" name="notes">
              <TextArea disabled={readonly} rows={4} />
            </Form.Item>
          </SelectContainer>
        </StyledSelects>
      </Form>
    </Container>
  );
};

const TEXT_DISABLED_COLOR = '#000000B3';

const Container = styled.div`
  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-picker-input > input[disabled] {
    color: black;
  }

  .ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    color: ${TEXT_DISABLED_COLOR};
  }

  .ant-input[disabled] {
    color: black;
  }
`;

const StyledSelects = styled.div``;

const SelectContainer = styled.div<{ wrap?: string }>`
  margin-bottom: 10px;

  ${({ wrap }) => (wrap == 'true') &&
    `
      display: flex;
      flex-wrap: wrap;
    `
  }
`;

const SelectWrapper = styled.div<{ widthPercent: number }>`
  padding-right: 10px;
  width: ${({ widthPercent }) => widthPercent}%;
`;
