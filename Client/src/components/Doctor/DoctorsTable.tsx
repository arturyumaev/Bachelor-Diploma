import React from 'react';
import styled from 'styled-components';
import Loader from "react-loader-spinner";
import { Table, Modal, Tooltip } from 'antd';
import {
  CloseSquareTwoTone,
  ExclamationCircleOutlined,
  LoadingOutlined,
  InfoCircleTwoTone,
} from '@ant-design/icons';
import Doctor from '../../interfaces/Doctor';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Location from '../../interfaces/Location';
import { Department } from '../../interfaces/Department';

const { confirm } = Modal;

type DoctorColumnDescription = {
  id: number;
  name: string;
  phone: string;
  email: string;
  locationId: number;
  departmentId: number;
  workExperience: number;
  academicDegree: string;
  notes: string;
}

interface IComponentProps {
  locations: Location[];
  locationsRecieved: boolean;
  doctors: Doctor[];
  doctorsLoading: boolean;
  departments: Department[];
  loadDoctors: () => void;
}

const DoctorsTable: React.FC<IComponentProps> = (props) => {
  const { locations, locationsRecieved, doctors, doctorsLoading, departments, loadDoctors } = props;

  const showConfirm = (text: DoctorColumnDescription, record: DoctorColumnDescription) => {
    confirm({
      title: 'Вы действительно хотите удалить доктора?',
      icon: <ExclamationCircleOutlined />,
      content: 'Это действие нельзя будет отменить',
      onOk() {
        fetchApi(`user/doctor/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(() => loadDoctors());
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
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Отделение',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (text: any, record: any) => {
        const title = departments
          ? departments.filter(d => d.id == text)[0].name
          : '-';

        return title;
      },
    },
    {
      title: 'Опыт работы',
      dataIndex: 'workExperience',
      key: 'workExperience',
    },
    {
      title: 'Ученая степень',
      dataIndex: 'academicDegree',
      key: 'academicDegree',
    },
    {
      title: 'Заметки',
      dataIndex: 'notes',
      key: 'notes',
      render: (text: any, record: any) => {
        return (
          <Tooltip title={text} color="blue">
            <InfoCircleTwoTone style={{ fontSize: '20px' }} className="doctor-info-icon" />
          </Tooltip>
        );
      },
    },
    {
      title: 'Локация',
      dataIndex: 'locationId',
      key: 'locationId',
      render: (text: any, record: any) => {
        return locationsRecieved
          ? <>{locations.filter(l => l.id == record.locationId)[0].locationName}</>
          : <LoadingOutlined />;
      },
    },
    {
      title: 'Действие',
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
  
  const doctorsToRender: DoctorColumnDescription[] = doctors.map(d => ({
    id: d.id,
    name: `${d.firstName} ${d.lastName}`,
    phone: d.phone,
    email: d.email,
    locationId: d.locationId,
    departmentId: d.departmentId,
    workExperience: d.workExperience,
    academicDegree: d.academicDegree,
    notes: d.notes,
  }));

  return (
    <Container>
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
    </Container>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  .doctor-info-icon {
    &:hover {
      cursor: pointer;
    }
  }
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

const DatePickerInputWrapper = styled.div`
  .ant-picker-input {
    color: black !important;
  }
`;

export default DoctorsTable;
