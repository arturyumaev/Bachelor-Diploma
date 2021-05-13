import React from 'react';
import styled from 'styled-components';
import Loader from "react-loader-spinner";
import moment from 'moment';
import { Table, Modal, DatePicker } from 'antd';
import {
  CloseSquareTwoTone,
  EyeOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Doctor from '../../interfaces/Doctor';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Location from '../../interfaces/Location';

const { confirm } = Modal;

type DoctorColumnDescription = {
  id: number;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  locationId: number;
}

interface IComponentProps {
  locations: Location[];
  locationsRecieved: boolean;
  doctors: Array<Doctor>;
  doctorsLoading: boolean;
  loadDoctors: () => void;
}

const DoctorsTable: React.FC<IComponentProps> = (props) => {
  const { locations, locationsRecieved, doctors, doctorsLoading, loadDoctors } = props;

  const showConfirm = (text: DoctorColumnDescription, record: DoctorColumnDescription) => {
    confirm({
      title: 'Do you want to delete doctor?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Birth date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (text: any, record: any) => {
        return (
          <DatePickerInputWrapper>
            <DatePicker defaultValue={moment(text)} disabled />
          </DatePickerInputWrapper>
        );
      },
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
      title: 'Location',
      dataIndex: 'locationId',
      key: 'locationId',
      render: (text: any, record: any) => {
        return locationsRecieved
          ? <>{locations.filter(l => l.id == record.locationId)[0].locationName}</>
          : <LoadingOutlined />;
      },
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
    locationId: d.locationId,
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

const DatePickerInputWrapper = styled.div`
  .ant-picker-input {
    color: black !important;
  }
`;

export default DoctorsTable;
