import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, notification } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Doctor from '../../interfaces/Doctor';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { AppDispatch, RootState } from '../../store/store';
import DoctorsTable from './DoctorsTable';
import { ModalContent } from './ModalContent';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Doctors: React.FC<OwnProps & StateProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  useEffect(() => {
    setDoctorsLoading(true);
    setTimeout(() => {
      fetchApi('user/doctor/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setDoctors(data.doctors))
        .then(() => setDoctorsLoading(false));
    }, 800);
  }, [dataUpdated]);

  const handleOk = (data: object) => {
    setConfirmLoading(true);
    setTimeout(() => {
      fetchApi('user/doctor', HTTPMethod.POST, data)
        .then(response => response.json)
        .then(() => setConfirmLoading(false))
        .then(() => setIsModalVisible(false))
        .then(() => notification.success({ message: 'User has been successfully created' }))
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
            <UserAddOutlined />
            New doctor
          </Button>
          <Modal
            title="New doctor"
            visible={isModalVisible}
            afterClose={() => {}}
            width={680}
            footer={null}
            confirmLoading={confirmLoading}
          >
          <ModalContent
            onSubmit={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
          />
          </Modal>
        </ButtonLayout>
      }
      <DoctorsLayout>
        <DoctorsTable
          doctors={doctors}
          doctorsLoading={doctorsLoading}
          loadDoctors={() => setDataUpdated(!dataUpdated)}
        />
      </DoctorsLayout>
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

const DoctorsLayout = styled.div``;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Doctors);