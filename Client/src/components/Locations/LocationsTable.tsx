import React from 'react';
import styled from 'styled-components';
import Loader from "react-loader-spinner";
import { Table, Modal } from 'antd';
import {
  CloseSquareTwoTone,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Location from '../../interfaces/Location';
import { fetchApi, HTTPMethod } from '../../api/Api';

const { confirm } = Modal;

type LocationColumnDescription = {
  id: number;
  locationName: string;
  address: string;
  phone: string;
  email: string;
}

interface IComponentProps {
  locations: Array<Location>;
  locationsLoading: boolean;
  loadLocations: () => void;
}

const LocationsTable: React.FC<IComponentProps> = (props) => {
  const { locations, locationsLoading, loadLocations } = props;

  const showConfirm = (text: LocationColumnDescription, record: LocationColumnDescription) => {
    confirm({
      title: 'Do you want to delete location?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`location/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(data => console.log(data))
          .then(() => loadLocations());
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
      title: 'Location name',
      dataIndex: 'locationName',
      key: 'locationName',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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
  
  const locationsToRender: LocationColumnDescription[] = locations.map(l => ({
    id: l.id,
    locationName: l.locationName,
    address: l.address,
    phone: l.phone,
    email: l.email,
  }));

  return (
    <div>
      {locationsLoading
      ? (
        <LoadingScreen>
          <Loader
            type="TailSpin"
            color="#007bff"
            height={60}
            width={60}
            visible={locationsLoading}
          />
        </LoadingScreen>
      )
      : (
        <Table
          columns={columns}
          dataSource={locationsToRender}
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

export default LocationsTable;
