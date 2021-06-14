import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Tag, Space, Modal, Button, notification, Spin } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
// import { ModalContent } from './ModalContent';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { Department } from '../../interfaces/Department';
import DepartmentsTable from './DepartmentsTable';
import { ModalContent } from './ModalContent';
// import RoomsTable from './RoomsTable';
// import Location from '../../interfaces/Location';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Departments: React.FC<StateProps & OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  useEffect(() => {
    setDepartmentsLoading(true);
    setTimeout(() => {
      fetchApi('department/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setDepartments(data.departments))
        .then(() => setDepartmentsLoading(false));
    }, 800);
  }, [dataUpdated]);

  const handleOk = (data: object) => {
    setConfirmLoading(true);
    setTimeout(() => {
      fetchApi('department', HTTPMethod.POST, data)
        .then(response => response.json)
        .then(() => setConfirmLoading(false))
        .then(() => setIsModalVisible(false))
        .then(() => notification.success({ message: 'Отделение успешно создано' }))
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
            <ApartmentOutlined />
            Новое отделение
          </Button>
          <Modal
            title="Новое отделение"
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
      <DepartmentsLayout>
        <DepartmentsTable
          departments={departments}
          departmentsLoading={departmentsLoading}
          loadDepartments={() => setDataUpdated(!dataUpdated)}
        />
      </DepartmentsLayout>
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

const DepartmentsLayout = styled.div``;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Departments);