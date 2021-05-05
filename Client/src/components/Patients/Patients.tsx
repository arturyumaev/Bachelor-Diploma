import React, { useState } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, Modal, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { ModalContent } from './ModalContent';
import PatientsTable from './PatientsTable';
import { fetchApi, HTTPMethod } from '../../api/Api';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Patients: React.FC<StateProps & OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleOk = (data: object) => {
    fetchApi('user/patient', HTTPMethod.POST, data)
      .then(response => response.json);

    setIsModalVisible(false);
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
            okText="Create"
            afterClose={() => {}}
            width={680}
            footer={null}
          >
            <ModalContent
              onSubmit={handleOk}
              onCancel={handleCancel}
            />
          </Modal>
        </ButtonLayout>
      }
      <PatientsLayout>
        <PatientsTable />
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