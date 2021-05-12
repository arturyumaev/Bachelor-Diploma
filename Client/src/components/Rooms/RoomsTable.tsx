import React, { useState, useEffect } from 'react';
import { Table, Modal } from 'antd';
import {
  CloseSquareTwoTone,
  EyeOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { fetchApi, HTTPMethod } from '../../api/Api';
import styled from 'styled-components';
import Patient from '../../interfaces/Patient';
import { Room } from '../../interfaces/Room';
import Location from '../../interfaces/Location';

const { confirm } = Modal;

type RoomColumnDescription = {
  id: number;
  name: string;
  floor: number;
  notes: string;
  locationId: number;
}

interface IComponentProps {
  locations: Location[];
  locationsRecieved: boolean;
  rooms: Array<Room>;
  roomsLoading: boolean;
  loadRooms: () => void;
}

const RoomsTable: React.FC<IComponentProps> = (props) => {
  const { locations, locationsRecieved, rooms, roomsLoading, loadRooms } = props;

  const showConfirm = (text: RoomColumnDescription, record: RoomColumnDescription) => {
    confirm({
      title: 'Do you want to delete room?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`room/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(data => console.log(data))
          .then(() => loadRooms());
      
        console.log(record.id);
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
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
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
  
  const roomsToRender: RoomColumnDescription[] = rooms.map(r => ({
    id: r.id,
    name: r.name,
    floor: r.floor,
    notes: r.notes,
    locationId: r.locationId,
  }));

  return (
    <div>
      {roomsLoading
      ? (
        <LoadingScreen>
          <Loader
            type="TailSpin"
            color="#007bff"
            height={60}
            width={60}
            visible={roomsLoading}
          />
        </LoadingScreen>
      )
      : (
        <Table
          columns={columns}
          dataSource={roomsToRender}
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

export default RoomsTable;
