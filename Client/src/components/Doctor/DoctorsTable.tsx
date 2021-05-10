import React from 'react';
import styled from 'styled-components';
import Loader from "react-loader-spinner";
import { Table, Modal } from 'antd';
import {
  CloseSquareTwoTone,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Doctor from '../../interfaces/Doctor';
import { fetchApi, HTTPMethod } from '../../api/Api';

const { confirm } = Modal;

type DoctorColumnDescription = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  id: number;
}

interface IComponentProps {
  doctors: Array<Doctor>;
  doctorsLoading: boolean;
  loadDoctors: () => void;
}

const DoctorsTable: React.FC<IComponentProps> = (props) => {
  const { doctors, doctorsLoading, loadDoctors } = props;

  const showConfirm = (text: DoctorColumnDescription, record: DoctorColumnDescription) => {
    confirm({
      title: 'Do you want to delete doctor?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`user/doctor/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(data => console.log(data))
          .then(() => loadDoctors());
      },
      onCancel() {
        console.log('Cancel');
      },
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
  
  const doctorsToRender: DoctorColumnDescription[] = doctors.map(d => ({
    id: d.id,
    name: `${d.firstName} ${d.lastName}`,
    birthDate: d.birthDate,
    phone: d.phone,
    email: d.email,
  }));

  return (
    <div>
      {doctorsLoading
      ? (
        <LoadingScreen>
          <Loader
            type="TailSpin"
            color="#007bff"
            height={60}
            width={60}
            visible={doctorsLoading}
          />
        </LoadingScreen>
      )
      : (
        <Table
          columns={columns}
          dataSource={doctorsToRender}
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

const ActionButtonsContainer = styled(FlexRow)``;

const ActionIconLayout = styled.div`
  margin-right: 8px;

  &:hover {
    cursor: pointer;
  } 
`;

export default DoctorsTable;
