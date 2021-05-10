import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, Modal, Button, notification, Spin } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { ModalContent } from './ModalContent';
import PatientsTable from './PatientsTable';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Patient from '../../interfaces/Patient';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Patients: React.FC<StateProps & OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [patientsLoading, setPatientsLoading] = useState<boolean>(true);
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  useEffect(() => {
    setPatientsLoading(true);
    setTimeout(() => {
      fetchApi('user/patient/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setPatients(data.patients))
        .then(() => setPatientsLoading(false));
    }, 800);
  }, [dataUpdated]);

  const handleOk = (data: object) => {
    setConfirmLoading(true);
    setTimeout(() => {
      fetchApi('user/patient', HTTPMethod.POST, data)
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
            New patient
          </Button>
          <Modal
            title="New patient"
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
      <PatientsLayout>
        <PatientsTable
          patients={patients}
          patientsLoading={patientsLoading}
          loadPatients={() => setDataUpdated(!dataUpdated)}
        />
      </PatientsLayout>
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

const PatientsLayout = styled.div`

`;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Patients);