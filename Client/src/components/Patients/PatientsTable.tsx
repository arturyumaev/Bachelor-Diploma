import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import {
  FormOutlined,
  CloseSquareTwoTone,
  EyeOutlined,
} from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { fetchApi, HTTPMethod } from '../../api/Api';
import styled from 'styled-components';
import Patient from '../../interfaces/Patient';

const PatientsTable = () => {
  const [patientsLoading, setPatientsLoading] = useState<boolean>(true);
  const [patients, setPatients] = useState<Array<Patient>>([]);

  useEffect(() => {
    setTimeout(() => {
      fetchApi('user/patient/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setPatients(data.patients))
        .then(() => setPatientsLoading(false));

    }, 1000);
  }, []);

  const columns = [
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
            <ActionIconLayout
              onClick={() => {}}
            >
              <FormOutlined
                style={iconStyles}
              />
            </ActionIconLayout>
            <ActionIconLayout
              onClick={() => {}}
            >
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
  
  const patientsToRender = patients.map(p => ({
    name: `${p.firstName} ${p.lastName}`,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
  }));

  console.log('patientsToRender', patientsToRender);

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
