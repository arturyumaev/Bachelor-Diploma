import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import Appointment from '../../interfaces/Appointment/Appointment';
import AppointmentsTable from './AppointmentsTable';
import Patient from '../../interfaces/Patient';

const { Title, Text } = Typography;

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

interface IComponentState {
  rooms: Room[],
  doctors: Doctor[],
  procedures: AppointmentProcedure[],
  patients: Patient[],
  appointments: Appointment[],
}

const Appointments: React.FC<StateProps & OwnProps> = (props) => {
  const [state, setState] = useState<IComponentState>({
    rooms: [],
    doctors: [],
    procedures: [],
    patients: [],
    appointments: [],
  });
  const [dataRecieved, setDataRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!dataRecieved) {
      Promise.all([
        fetchApi('appointment/-1', HTTPMethod.GET),
        fetchApi('user/doctor/-1', HTTPMethod.GET),
        fetchApi('room/-1', HTTPMethod.GET),
        fetchApi('procedure/-1', HTTPMethod.GET),
        fetchApi('user/patient/-1', HTTPMethod.GET),
      ])
      .then(values => { setDataRecieved(true); return values; })
      .then(values => Promise.all(values.map(res => res.json())))
      .then((data: Array<any>) => {
        let temp: any = {};
        data.map((obj: any) => { temp = {...temp, ...obj}; })
        setState(temp);
      });
    }
  });

  console.log('state', state);

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
          dataLoading={!dataRecieved}
          appointments={state.appointments}
          doctors={state.doctors}
          patients={state.patients}
          rooms={state.rooms}
          procedures={state.procedures}
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