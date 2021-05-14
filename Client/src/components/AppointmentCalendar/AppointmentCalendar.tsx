import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment';
import styled from 'styled-components';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import { fetchApi, HTTPMethod } from '../../api/Api';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);

  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

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
        Filters
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
  justify-content: space-between;
  padding: 0px 8px;
`;

export default AppointmentCalendar;
