import React from 'react';
import { Table, Modal } from 'antd';
import {
  CloseSquareTwoTone,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { fetchApi, HTTPMethod } from '../../api/Api';
import styled from 'styled-components';
import Patient from '../../interfaces/Patient';

const { confirm } = Modal;

type PatientColumnDescription = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  id: number;
}

interface IComponentProps {
  patients: Array<Patient>;
  patientsLoading: boolean;
  loadPatients: () => void;
}

const PatientsTable: React.FC<IComponentProps> = (props) => {
  const { patients, patientsLoading, loadPatients } = props;

  const showConfirm = (text: PatientColumnDescription, record: PatientColumnDescription) => {
    confirm({
      title: 'Do you want to delete patient?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`user/patient/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(() => loadPatients());
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: '#id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Birth date',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => {
        const iconStyles = { fontSize: '22px' };

        return (
          <ActionButtonsContainer>
            <ActionIconLayout
              onClick={() => {}}
            >
              <EyeOutlined
                style={iconStyles}
              />
            </ActionIconLayout>
            <ActionIconLayout onClick={() => showConfirm(text, record)}>
              <CloseSquareTwoTone
                twoToneColor="#eb2f96"
                style={iconStyles}
              />
            </ActionIconLayout>
          </ActionButtonsContainer>
        );
      }
    },
  ];
  
  const patientsToRender: PatientColumnDescription[] = patients.map(p => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
  }));

  return (
    <div>
      {patientsLoading
      ? (
        <LoadingScreen>
          <Loader
            type="TailSpin"
            color="#007bff"
            height={60}
            width={60}
            visible={patientsLoading}
          />
        </LoadingScreen>
      )
      : (
        <Table
          columns={columns}
          dataSource={patientsToRender}
        />
      )}
    </div>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoadingScreen = styled(FlexRow)`
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const ActionButtonsContainer = styled(FlexRow)`
`;

const ActionIconLayout = styled.div`
  margin-right: 8px;

  &:hover {
    cursor: pointer;
  } 
`;

export default PatientsTable;
