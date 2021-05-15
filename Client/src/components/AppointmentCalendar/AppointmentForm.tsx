import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Select, Form, DatePicker, TimePicker, Input } from 'antd';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import Doctor from '../../interfaces/Doctor';

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
};

export const AppointmentForm: React.FC<IComponentProps> = props => {
  const {
    doctors, 
    procedures,
    departments,
    doctorId,
    procedureId,
    departmentId,
    from,
    to,
  } = props;
  const [form] = Form.useForm();

  console.log({ 
    doctorId,
    procedureId,
    departmentId,
   })


  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={{  }}
        // onValuesChange={onRequiredTypeChange}
      >
        <StyledSelects>
          <SelectContainer>
            <Form.Item label="Patient" name="patientId">
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select patient"
                optionFilterProp="children"
                // onChange={onChange}
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                {[]}
              </Select>
            </Form.Item>
          </SelectContainer>
          <SelectContainer>
            <Form.Item label="Procedure" name="procedureId">
              <Select
                defaultValue={procedures.find(p => p.id == procedureId)?.id}
                disabled
                style={{ width: '100%' }}
                optionFilterProp="children"
              >
                {procedures.map(p => <Option value={p.id} key={p.id}>{p.name}</Option>)}
              </Select>
            </Form.Item>
          </SelectContainer>
          <SelectContainer wrap>
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Doctor" name="doctorId" style={{ border: '1px solid pink' }}>
                <Select
                  defaultValue={doctors.find(d => d.id == doctorId)?.id}
                  disabled
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                >
                  {doctors.map(d => <Option value={d.id} key={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={50}>
              <Form.Item label="Department" name="departmentId" style={{ border: '1px solid pink' }}>
                <Select
                  defaultValue={departments.find(d => d.id == departmentId)?.id}
                  disabled
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                >
                  {departments.map(d => <Option value={d.id} key={d.id}>{d.name}</Option>)}
                </Select>
              </Form.Item>
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer wrap>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="Date">
                <DatePicker defaultValue={moment(from)} disabled/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="From" name="scheduledTime">
                <TimePicker defaultValue={moment(from)} disabled format={'HH:mm'}/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="From" name="scheduledEndTime">
                <TimePicker defaultValue={moment(to)} disabled format={'HH:mm'}/>
              </Form.Item>
            </SelectWrapper>
            <SelectWrapper widthPercent={25}>
              <Form.Item label="From">
                <Input defaultValue={'asd'} disabled placeholder="Basic usage" />
              </Form.Item>
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer>
          DISABLED location
          </SelectContainer>
      </StyledSelects>
      </Form>
    </Container>
  );
};

const TEXT_DISABLED_COLOR = '#000000BF'

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
`;

const StyledSelects = styled.div`
  border: 1px solid red;
`;

const SelectContainer = styled.div<{ wrap?: boolean }>`
  border: 1px solid green;
  margin-bottom: 10px;

  ${({ wrap }) => wrap &&
    `
      display: flex;
      flex-wrap: wrap;
    `
  }
`;

const SelectWrapper = styled.div<{ widthPercent: number }>`
  border: 1px dashed black;
  padding-right: 10px;
  width: ${({ widthPercent }) => widthPercent}%;
`;
