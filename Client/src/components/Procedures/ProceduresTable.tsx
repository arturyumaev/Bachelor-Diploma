import React, { useState, useEffect } from 'react';
import { Table, Modal, Select } from 'antd';
import {
  CloseSquareTwoTone,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { fetchApi, HTTPMethod } from '../../api/Api';
import styled from 'styled-components';
import { Room } from '../../interfaces/Room';
import Location from '../../interfaces/Location';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { filter } from 'lodash';

const { Option } = Select;
const { confirm } = Modal;

type ProcedureColumnDescription = {
  id: number;
  name: string;
  doctorId: number;
  locationId: number;
  roomId: number;
  duration: number;
  price: number;
  notes: string;
}

interface IComponentProps {
  procedures: AppointmentProcedure[];
  locations: Location[];
  rooms: Room[];
  doctors: Doctor[];
  loadProcedures: () => void;
}

interface IFilterOptions {
  doctorId?: number;
  locationId?: number;
  roomId?: number;
}

const defaultFilterOptions: IFilterOptions = {
  doctorId: undefined,
  locationId: undefined,
  roomId: undefined,
}

const filterOnOptions = (
  procedures: AppointmentProcedure[],
  filterOptions: IFilterOptions,
  ): AppointmentProcedure[] => {
  const filteredProcedures = procedures
    .filter(p => filterOptions.doctorId
      ? p.doctorId == filterOptions.doctorId
      : true
    )
    .filter(p => filterOptions.locationId
      ? p.locationId == filterOptions.locationId
      : true
    )
    .filter(p => filterOptions.roomId
      ? p.roomId == filterOptions.roomId
      : true
    );

  return filteredProcedures;
};

const ProceduresTable: React.FC<IComponentProps> = (props) => {
  const { procedures, locations, rooms, doctors, loadProcedures } = props;

  const [dataToRender, setDataToRender] = useState<AppointmentProcedure[]>(procedures);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>(defaultFilterOptions);

  useEffect(() => {
    setDataToRender(procedures);
  }, [procedures]);

  const showConfirm = (text: ProcedureColumnDescription, record: ProcedureColumnDescription) => {
    confirm({
      title: 'Do you want to delete procedure?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        fetchApi(`procedure/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(() => loadProcedures());
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
      title: 'Doctor',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (text: number, record: any) => {
        if (doctors.length) {
          const doctor = doctors.filter(d => d.id == text)[0];
          return `${doctor.firstName} ${doctor.lastName}`;
        }

        return <LoadingOutlined />;
      }
    },
    {
      title: 'Location',
      dataIndex: 'locationId',
      key: 'locationId',
      render: (text: number, record: any) => {
        if (locations.length) {
          const location = locations.filter(l => l.id == text)[0];
          return location.locationName;
        }

        return <LoadingOutlined />;
      }
    },
    {
      title: 'Room',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (text: number, record: any) => {
        if (rooms.length) {
          const room = rooms.filter(r => r.id == text)[0];
          return room.name;
        }

        return <LoadingOutlined />;
      }
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
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

  const proceduresToRender: ProcedureColumnDescription[] = filterOnOptions(dataToRender, filterOptions)
    .map(p => ({
      id: p.id,
      name: p.name,
      doctorId: p.doctorId,
      locationId: p.locationId,
      roomId: p.roomId,
      duration: p.duration,
      price: p.price,
      notes: p.notes,
  }));

  return (
    <Container>
      <FiltersContainer>
        <FilterOptionWrapper size={300}>
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a doctor"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, doctorId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {doctors.map(d => <Option key={d.id} value={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a location"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, locationId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {locations.map(l => <Option key={l.id} value={l.id}>{l.locationName}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            disabled={!filterOptions.locationId}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a room"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, roomId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              (filterOptions.locationId
                ? rooms.filter(r => r.locationId == filterOptions.locationId)
                : rooms
              ).map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)
            }
          </Select>
        </FilterOptionWrapper>
      </FiltersContainer>
      <Table
        columns={columns}
        dataSource={proceduresToRender}
      />
    </Container>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div``;

const ActionButtonsContainer = styled(FlexRow)``;

const ActionIconLayout = styled.div`
  margin-right: 8px;

  &:hover {
    cursor: pointer;
  } 
`;

const FiltersContainer = styled(FlexRow)``;

const FilterOptionWrapper = styled.div<{ size?: number }>`
  width: ${({ size }) => size ?? 200}px;
  margin: 5px 0px 15px 15px;
`;


export default ProceduresTable;
