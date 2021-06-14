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
import { Department } from '../../interfaces/Department';
import { connect } from 'react-redux';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { AppDispatch } from '../../store/store';

const { Option } = Select;
const { confirm } = Modal;

type ProcedureColumnDescription = {
  id: number;
  name: string;
  doctorId: number;
  locationId: number;
  roomId: number;
  departmentId: number;
  duration: number;
  price: number;
  notes: string;
}

interface IComponentProps {
  procedures: AppointmentProcedure[];
  departments: Department[];
  locations: Location[];
  rooms: Room[];
  doctors: Doctor[];
  loadProcedures: () => void;
}

interface IFilterOptions {
  doctorId?: number;
  locationId?: number;
  roomId?: number;
  departmentId?: number;
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
    )
    .filter(p => filterOptions.departmentId
      ? p.departmentId == filterOptions.departmentId
      : true
    );

  return filteredProcedures;
};

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

const ProceduresTable: React.FC<StateProps & IComponentProps> = (props) => {
  const accessRole = props.userProfile.accessControl;
  const { procedures, departments, locations, rooms, doctors, loadProcedures } = props;

  const defaultFilterOptions: IFilterOptions = {
    doctorId: accessRole == 'Doctor' ? props.userProfile.id : undefined,
    locationId: accessRole == 'Doctor' ? props.userProfile.locationId : undefined,
    departmentId: accessRole =='Doctor' ? props.userProfile.departmentId : undefined,
    roomId: undefined,
  }

  const [dataToRender, setDataToRender] = useState<AppointmentProcedure[]>(procedures);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>(defaultFilterOptions);

  useEffect(() => {
    setDataToRender(procedures);
  }, [procedures]);

  const showConfirm = (text: ProcedureColumnDescription, record: ProcedureColumnDescription) => {
    confirm({
      title: 'Вы хотите удалить процедуру?',
      icon: <ExclamationCircleOutlined />,
      content: 'Это действие нельзя будет отменить',
      onOk() {
        fetchApi(`procedure/${record.id}`, HTTPMethod.DELETE)
          .then(res => res.json())
          .then(() => loadProcedures());
      },
      onCancel() {},
    });
  };

  const columns: any = [
    {
      title: '#id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Отделение',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (text: number, record: any) => {
        if (departments.length) {
          const department = departments.filter(d => d.id == text)[0];
          return department.name;
        }

        return <LoadingOutlined />;
      }
    },
    {
      title: 'Доктор',
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
      title: 'Локация',
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
      title: 'Кабинет',
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
      title: 'Продолж. (мин)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Заметки',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  if (props.userProfile.accessControl == 'Admin') {
    columns.push(
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
      }
    )
  }

  const proceduresToRender: ProcedureColumnDescription[] = filterOnOptions(dataToRender, filterOptions)
    .map(p => ({
      id: p.id,
      name: p.name,
      doctorId: p.doctorId,
      locationId: p.locationId,
      departmentId: p.departmentId,
      roomId: p.roomId,
      duration: p.duration,
      price: p.price,
      notes: p.notes,
  }));

  return (
    <Container>
      <FiltersContainer>
        <FilterOptionWrapper>
          <Select
            defaultValue={accessRole == 'Doctor' ? props.userProfile.departmentId : undefined}
            disabled={accessRole !== 'Admin'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите отделение"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, departmentId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            defaultValue={accessRole == 'Doctor' ? props.userProfile.id : undefined}
            disabled={accessRole !== 'Admin'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите доктора"
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
            defaultValue={accessRole == 'Doctor' ? props.userProfile.locationId : undefined}
            disabled={accessRole !== 'Admin'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите локацию"
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
            disabled={!filterOptions.locationId || accessRole !== 'Admin'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите кабинет"
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
  &:hover {
    cursor: pointer;
  } 
`;

const FiltersContainer = styled(FlexRow)`
  justify-content: space-between;
`;

const FilterOptionWrapper = styled.div<{ size?: number }>`
  width: 260px;
  margin: 5px 0px 15px 0px;
`;

const mapStateToProps = (state: any) => {
  return {
    userProfile: state.userProfile,
  }
};

export default connect(
  mapStateToProps,
)(ProceduresTable);
