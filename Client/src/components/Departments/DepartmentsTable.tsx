import React from 'react';
import { Table, Modal } from 'antd';
import {
  CloseSquareTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { fetchApi, HTTPMethod } from '../../api/Api';
import styled from 'styled-components';
import { Department } from '../../interfaces/Department';

const { confirm } = Modal;

type DepartmentColumnDescription = {
  id: number;
  name: string;
}

interface IComponentProps {
  departments: Array<Department>;
  departmentsLoading: boolean;
  loadDepartments: () => void;
}

const DepartmentsTable: React.FC<IComponentProps> = (props) => {
  const { departments, departmentsLoading, loadDepartments } = props;

  const showConfirm = (text: DepartmentColumnDescription, record: DepartmentColumnDescription) => {
    confirm({
      title: 'Do you want to delete department?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`department/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(() => loadDepartments());
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
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => {
        const iconStyles = { fontSize: '22px' };

        return (
          <ActionButtonsContainer>
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
  
  const departmentsToRender: DepartmentColumnDescription[] = departments.map(d => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <div>
      {departmentsLoading
      ? (
        <LoadingScreen>
          <Loader
            type="TailSpin"
            color="#007bff"
            height={60}
            width={60}
            visible={departmentsLoading}
          />
        </LoadingScreen>
      )
      : (
        <Table
          columns={columns}
          dataSource={departmentsToRender}
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

export default DepartmentsTable;
