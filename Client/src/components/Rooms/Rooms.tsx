import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button, notification } from 'antd';
import { ForkOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { ModalContent } from './ModalContent';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Room } from '../../interfaces/Room';
import RoomsTable from './RoomsTable';
import Location from '../../interfaces/Location';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Rooms: React.FC<StateProps & OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [roomsLoading, setRoomsLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  const [locations, setLocations] = useState<Array<Location>>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  useEffect(() => {
    if (!locationsRecieved) {
      setTimeout(() => {
        fetchApi('location/-1', HTTPMethod.GET)
          .then(result => result.json())
          .then(data => setLocations(data.locations))
          .then(() => setLocationsRecieved(true));
      }, 1200);
    }
  });

  useEffect(() => {
    setRoomsLoading(true);
    setTimeout(() => {
      fetchApi('room/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setRooms(data.rooms))
        .then(() => setRoomsLoading(false));
    }, 800);
  }, [dataUpdated]);

  const handleOk = (data: object) => {
    setConfirmLoading(true);
    setTimeout(() => {
      fetchApi('room', HTTPMethod.POST, data)
        .then(response => response.json)
        .then(() => setConfirmLoading(false))
        .then(() => setIsModalVisible(false))
        .then(() => notification.success({ message: 'Room has been successfully created' }))
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
            <ForkOutlined />
            Новый кабинет
          </Button>
          <Modal
            title="Новый кабинет"
            visible={isModalVisible}
            afterClose={() => {}}
            width={680}
            footer={null}
            confirmLoading={confirmLoading}
          >
            <ModalContent
              locations={locations}
              onSubmit={handleOk}
              onCancel={handleCancel}
              confirmLoading={confirmLoading}
            />
          </Modal>
        </ButtonLayout>
      }
      <RoomsLayout>
        <RoomsTable
          locations={locations}
          locationsRecieved={locationsRecieved}
          rooms={rooms}
          roomsLoading={roomsLoading}
          loadRooms={() => setDataUpdated(!dataUpdated)}
        />
      </RoomsLayout>
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
  padding-bottom: 16px;
`;

const RoomsLayout = styled.div`

`;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Rooms);