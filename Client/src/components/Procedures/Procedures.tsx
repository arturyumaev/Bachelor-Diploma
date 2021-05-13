import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button, notification, Typography } from 'antd';
import { ReconciliationOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { ModalContent } from './ModalContent';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';
// import RoomsTable from './RoomsTable';
import Location from '../../interfaces/Location';
import Doctor from '../../interfaces/Doctor';
import ProceduresTable from './ProceduresTable';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';

const { Title, Text } = Typography;

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Procedures: React.FC<StateProps & OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [roomsRecieved, setRoomsRecieved] = useState<boolean>(false);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  const [locations, setLocations] = useState<Array<Location>>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);

  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!locationsRecieved) {
      fetchApi('location/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setLocations(data.locations))
        .then(() => setLocationsRecieved(true));
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
  });

  useEffect(() => {
    if (!proceduresRecieved) {
      fetchApi('procedure/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setProcedures(data.procedures))
        .then(() => setProceduresRecieved(true));
    }
  }, [dataUpdated]);

  const handleOk = (data: object) => {
    setConfirmLoading(true);
    setTimeout(() => {
      fetchApi('procedure', HTTPMethod.POST, data)
        .then(response => response.json)
        .then(() => setConfirmLoading(false))
        .then(() => setIsModalVisible(false))
        .then(() => setProceduresRecieved(false))
        .then(() => notification.success({ message: 'Procedure has been successfully created' }))
        .then(() => setDataUpdated(!dataUpdated));
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Container>
      {props.userProfile.accessControl === 'Admin' &&
        <ButtonLayout> 
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            <ReconciliationOutlined />
            New procedure
          </Button>
          <Title level={3} style={{ marginLeft: '15px' }}>
            <Text type="secondary">
              Filters
            </Text>
          </Title>
          <Modal
            title="New procedure"
            visible={isModalVisible}
            afterClose={() => {}}
            width={680}
            footer={null}
            confirmLoading={confirmLoading}
          >
            <ModalContent
              doctors={doctors}
              locations={locations}
              onSubmit={handleOk}
              onCancel={handleCancel}
              confirmLoading={confirmLoading}
            />
          </Modal>
        </ButtonLayout>
      }
      <ProceduresLayout>
        <ProceduresTable
          locations={locations}
          rooms={rooms}
          doctors={doctors}
          procedures={procedures}
          loadProcedures={() => setDataUpdated(!dataUpdated)}
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
)(Procedures);