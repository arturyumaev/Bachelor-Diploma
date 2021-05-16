import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Select, Tag, Modal, Button } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { AppointmentForm, IAppointmentData } from './AppointmentForm';
import Location from '../../interfaces/Location';

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

const { Option } = Select;
const localizer = momentLocalizer(moment);

const defaultAppointmentData: IAppointmentData = {
  doctorId: -1,
  departmentId: -1,
  procedureId: -1,
  from: new Date(),
  to: new Date(),
}

export const convertMinsToHrsMins = (mins?: number) => {
  if (mins) {
    let h: any = Math.floor(mins / 60);
    let m: any = mins % 60;
    // h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}h ${m}m`;
  }
}

const AppointmentCalendar = () => {
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);
  
  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);
  
  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);
  const [selectedDoctortId, setSelectedDoctorId] = useState<number | undefined>(undefined);
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | undefined>(undefined);

  const [events, setEvents] = useState<Event[]>([]);
  const [appointmentData, setAppointmentData] = useState<IAppointmentData>(defaultAppointmentData);

  const [openModal, setOpenModal] = useState<boolean>(false);

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

    if (!locationsRecieved) {
      fetchApi('location/-1', HTTPMethod.GET)
        .then((result) => { setLocationsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setLocations(data.locations));
    }
  }, [doctorsRecieved, proceduresRecieved, departmentsRecieved, locationsRecieved]);

  useEffect(() => {
    if (selectedProcedureId) {
      setOpenModal(true);
    }
  }, [appointmentData]);

  const handleModalSubmit = (values: any) => {
    console.log(values);
  }

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
              setSelectedProcedureId(undefined);
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
              setSelectedProcedureId(undefined);
              if (value) {
                setSelectedDepartmentId(doctors.filter(d => d.id == value)[0].departmentId);
              }
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
        <FilterOptionWrapper width={350}>
          <Select
            disabled={!selectedDoctortId}
            value={selectedProcedureId}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a procedure"
            optionFilterProp="children"
            onChange={(value: number, option: any) => {
              console.log('setting up', value);
              setSelectedProcedureId(value);
            }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(selectedDoctortId
                ? procedures.filter(p => p.doctorId == selectedDoctortId)
                : procedures
              ).map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
          </Select>
        </FilterOptionWrapper>
        {!!selectedProcedureId &&
          <FilterOptionWrapper>
            <Tag color="#87d068">
              Duration: {convertMinsToHrsMins(procedures.find(p => p.id == selectedProcedureId)?.duration)}
            </Tag>
          </FilterOptionWrapper>
        }
      </FiltersContainer>
      <Calendar
        selectable={!!selectedProcedureId}
        culture="en-GB"
        defaultView={'week'}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2021, 4, 1, 8, 30)}
        max={new Date(2021, 4, 1, 18, 0)}

        onSelectSlot={(slotInfo) => {
          const event: Event = { start: new Date(slotInfo.start), end: new Date(slotInfo.end), title: 'test' };
          setAppointmentData({
            doctorId: selectedDoctortId ?? -1,
            procedureId: selectedProcedureId ?? -1,
            departmentId: selectedDepartmentId ?? -1,
            from: new Date(slotInfo.start),
            to: new Date(slotInfo.end),
          });
          // setOpenModal(true);
          // setEvents([...events, event]);
        }}
      />
      <Modal
        title="New appointment"
        width={700}
        visible={openModal}
        // onOk={() => handleModalSubmit()}
        onCancel={() => setOpenModal(false)}
        destroyOnClose={true}
        footer={
          [
            <Button form="appointmentForm" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>,
            <Button type="primary" form="appointmentForm" key="submit" htmlType="submit">
              Submit
            </Button>
          ]
        }
      >
        <AppointmentForm
          {...appointmentData}
          departments={departments}
          procedures={procedures}
          doctors={doctors}
          locations={locations}
          onSubmit={handleModalSubmit}
        />
      </Modal>
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

const FilterOptionWrapper = styled.div<{ width?: number }>`
  width: ${({ width }) => width ?? 260}px;
  margin: 5px 10px 15px 0px;
`;

export default AppointmentCalendar;
