import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Select } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import { fetchApi, HTTPMethod } from '../../api/Api';

const { Option } = Select;
const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);

  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);
  const [selectedDoctortId, setSelectedDoctorId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!doctorsRecieved) {
      fetchApi('user/doctor/-1', HTTPMethod.GET)
        .then((result) => { setDoctorsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setDoctors(data.doctors));
    }

    if (!proceduresRecieved) {
      fetchApi('procedure/-1', HTTPMethod.GET)
        .then((result) => { setProceduresRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setProcedures(data.procedures));
    }

    if (!departmentsRecieved) {
      fetchApi('department/-1', HTTPMethod.GET)
        .then((result) => { setDepartmentsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setDepartments(data.departments));
    }
  }, [doctorsRecieved, proceduresRecieved, departmentsRecieved]);

  return (
    <Container>
      <FiltersContainer>
        <FilterOptionWrapper>
          <Select
            value={selectedDepartmentId}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a department"
            optionFilterProp="children"
            onChange={(value: number, option: any) => {
              setSelectedDepartmentId(value);
              setSelectedDoctorId(undefined);
            }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            value={selectedDoctortId}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a doctor"
            optionFilterProp="children"
            onChange={(value: number, option: any) => {
              setSelectedDoctorId(value);
              setSelectedDepartmentId(doctors.filter(d => d.id == value)[0].departmentId);
            }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(selectedDepartmentId
                ? doctors.filter(d => d.departmentId == selectedDepartmentId)
                : doctors
              ).map(d => <Option key={d.id} value={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)}
          </Select>
        </FilterOptionWrapper>
      </FiltersContainer>
      <Calendar
        selectable
        culture="en-GB"
        defaultView={'week'}
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2021, 4, 1, 8, 30)}
        max={new Date(2021, 4, 1, 18, 0)}

        onSelectSlot={(slotInfo) => console.log(slotInfo)}
      />
    </Container>
  );
};

const Container = styled.div`
  height: 70vh;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  padding: 0px 8px;
`;

const FilterOptionWrapper = styled.div`
  width: 260px;
  margin: 5px 0px 15px 0px;
`;

export default AppointmentCalendar;
