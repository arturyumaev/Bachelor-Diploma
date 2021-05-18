import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button, notification, Typography } from 'antd';
import { ReconciliationOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
// import { ModalContent } from './ModalContent';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';
// import RoomsTable from './RoomsTable';
import Location from '../../interfaces/Location';
import Doctor from '../../interfaces/Doctor';
// import ProceduresTable from './ProceduresTable';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import Appointment from '../../interfaces/Appointment/Appointment';
import AppointmentsTable from './AppointmentsTable';

const { Title, Text } = Typography;

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Appointments: React.FC<StateProps & OwnProps> = (props) => {
  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [roomsRecieved, setRoomsRecieved] = useState<boolean>(false);
  // const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  // const [locations, setLocations] = useState<Array<Location>>([]);
  // const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);

  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);

  // const [departments, setDepartments] = useState<Array<Department>>([]);
  // const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsRecieved, setAppointmentsRecieved] = useState<boolean>(false);

  console.log(appointments);

  useEffect(() => {
    if (!appointmentsRecieved) {
      fetchApi('appointment/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setAppointments(data.appointments))
        .then(() => setAppointmentsRecieved(true));
    }

    if (!doctorsRecieved) {
      fetchApi('user/doctor/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setDoctors(data.doctors))
        .then(() => setDoctorsRecieved(true));
    }

    if (!roomsRecieved) {
      fetchApi('room/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setRooms(data.rooms))
        .then(() => setRoomsRecieved(true));
    }

    if (!proceduresRecieved) {
      fetchApi('procedure/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setProcedures(data.procedures))
        .then(() => setProceduresRecieved(true));
    }
  });

  return (
    <Container>
      <ButtonLayout>
        <Title level={3}>
          <Text type="secondary">
            Filters
          </Text>
        </Title>
      </ButtonLayout>
      <ProceduresLayout>
        <AppointmentsTable
          appointments={appointments}
          doctors={doctors}
          // departments={departments}
          // locations={locations}
          rooms={rooms}
          procedures={procedures}
          // loadProcedures={() => setDataUpdated(!dataUpdated)}
        />
      </ProceduresLayout>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonLayout = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding-bottom: 16px;

  .ant-typography {
    margin-bottom: 0px;
  }
`;

const ProceduresLayout = styled.div``;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Appointments);