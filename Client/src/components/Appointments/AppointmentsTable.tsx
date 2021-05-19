import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Table, Select, Modal, TimePicker } from 'antd';
import Loader from "react-loader-spinner";
import {
  CloseSquareTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import Appointment from '../../interfaces/Appointment/Appointment';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { AppDispatch } from '../../store/store';
import dayjs from 'dayjs';
import moment from 'moment';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Room } from '../../interfaces/Room';
import Patient from '../../interfaces/Patient';

const { confirm } = Modal;
const { Option } = Select;

type AppointmentColumnDescription = {
  id: number;
  doctorId: number;
  patientId: number;
  appointmentProcedureId: number;
  roomId: number;
  notes: string;
  scheduledTime: string;
  scheduledEndTime: string;
  date: string;
}

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

interface IComponentProps {
  dataLoading: boolean;
  appointments: Appointment[];
  doctors: Doctor[];
  procedures: AppointmentProcedure[];
  rooms: Room[];
  patients: Patient[];
}

interface IFilterOptions {
  doctorId?: number;
  patientId?: number;
  procedureId?: number;
}

const filterOnOptions = (
  appointments: Appointment[],
  filterOptions: IFilterOptions,
  ): Appointment[] => {
  const filteredAppointments = appointments
    .filter(a => filterOptions.doctorId
      ? a.doctorId == filterOptions.doctorId
      : true
    )
    .filter(a => filterOptions.patientId
      ? a.patientId == filterOptions.patientId
      : true
    )
    .filter(a => filterOptions.procedureId
      ? a.appointmentProcedureId == filterOptions.procedureId
      : true
    )

  return filteredAppointments;
};

const AppointmentsTable: React.FC<IComponentProps & StateProps> = React.memo((props) => {
  const {
    dataLoading,
    appointments,
    doctors,
    procedures,
    rooms,
    patients,
  } = props;
  if (dataLoading) {
    return (
      <LoadingScreen>
        <Loader
          type="TailSpin"
          color="#007bff"
          height={60}
          width={60}
          visible
        />
      </LoadingScreen>
    );
  }

  const userProfile = props.userProfile;
  const { accessControl } = userProfile;

  const defaultFilterOptions: IFilterOptions = {
    doctorId: accessControl == 'Doctor' ? userProfile.id : undefined,
    patientId: accessControl == 'Patient' ? userProfile.id : undefined,
    procedureId: undefined,
  };

  const [dataToRender, setDataToRender] = useState<Appointment[]>(appointments);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>(defaultFilterOptions);

  useEffect(() => {
    setDataToRender(appointments);
  }, [appointments]);

  const showConfirm = (text: AppointmentColumnDescription, record: AppointmentColumnDescription) => {
    confirm({
      title: 'Do you want to delete appointment?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        // fetchApi(`appointment/${record.id}`, HTTPMethod.DELETE)
        //   .then(res => res.json())
        //   .then(() => loadAppointments());
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
      title: 'Doctor',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (text: string, record: AppointmentColumnDescription) => {
        const doctor = doctors.find(d => d.id == record.doctorId);
        return `${doctor?.firstName} ${doctor?.lastName}`;
      },
    },
    {
      title: 'Patient',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (text: string, record: AppointmentColumnDescription) => {
        const patient = patients.find(p => p.id == record.patientId);
        return `${patient?.firstName} ${patient?.lastName}`;
      },
    },
    {
      title: 'Procedure',
      dataIndex: 'appointmentProcedureId',
      key: 'appointmentProcedureId',
      render: (text: string, record: AppointmentColumnDescription) => {
        const procedure = procedures.find(p => p.id == record.appointmentProcedureId);
        return procedure?.name;
      },
    },
    {
      title: 'Room',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (text: string, record: AppointmentColumnDescription) => {
        const room = rooms.find(r => r.id == record.roomId);
        return room?.name;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string, record: AppointmentColumnDescription) => {
        return dayjs(text).format('DD/MM/YYYY');
      }
    },
    {
      title: 'Time',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (text: string, record: AppointmentColumnDescription) => {
        return (
          <TimeTable>
            <LeftColumn>
              <TimeTableTitle>
                From
              </TimeTableTitle>
              <TimeTableTitle>
                To
              </TimeTableTitle>
            </LeftColumn>
            <RightColumn>
              <div style={{ display: 'flex-inline' }}>
              <TimePicker value={moment(text)} disabled format={'HH:mm'}/>
              <TimePicker value={moment(record.scheduledEndTime)} disabled format={'HH:mm'}/>
              </div>
            </RightColumn>
          </TimeTable>
        );
      }
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  if (props.userProfile.accessControl == 'Admin') {
    columns.push(
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
      }
    );
  }

  const filterByAccess = (apps: Appointment[]): Appointment[] => {
    const profile = props.userProfile;
    const { accessControl } = profile;

    if (accessControl == 'Doctor') {
      return apps.filter(ap => ap.doctorId == profile.id);
    }

    if (accessControl == 'Patient') {
      return apps.filter(ap => ap.patientId == profile.id);
    }

    return apps;
  }

  const appointmentsToRender: AppointmentColumnDescription[] = filterOnOptions(filterByAccess(dataToRender), filterOptions)
    .map(app => ({
      id: app.id,
      doctorId: app.doctorId,
      patientId: app.patientId,
      appointmentProcedureId: app.appointmentProcedureId,
      roomId: app.roomId,
      notes: app.notes,
      scheduledTime: app.scheduledTime,
      scheduledEndTime: app.scheduledEndTime,
      date: app.scheduledTime,
    }));

  return (
    <Container>
      <FiltersContainer>
        <FilterOptionWrapper>
          <Select
            defaultValue={accessControl == 'Doctor' ? props.userProfile.id : undefined}
            disabled={accessControl == 'Doctor'}
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
            defaultValue={accessControl == 'Patient' ? props.userProfile.id : undefined}
            disabled={accessControl == 'Patient'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a patient"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, patientId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {patients.map(p => <Option key={p.id} value={p.id}>{`${p.firstName} ${p.lastName}`}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Select a procedure"
            optionFilterProp="children"
            onChange={(value: number, option: any) => setFilterOptions({ ...filterOptions, procedureId: value })}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {procedures.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
          </Select>
        </FilterOptionWrapper>
      </FiltersContainer>
      <Table
        columns={columns}
        dataSource={appointmentsToRender}
      />
    </Container>
  );
});

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const TimeTable = styled.div`
  display: flex;
  flex-direction: row;

  .ant-picker-input > input[disabled] {
    color: black;
  }
`;

const LeftColumn = styled.div`
  height: 64px;
  width: 50px;
`;

const RightColumn = styled.div`
  width: 92px;
`;

const TimeTableTitle = styled.div`
  width: 100%;
  height: 50%;
  padding: 0 auto;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  .ant-picker {
    width: 90px !important;
  }
`;

const ActionButtonsContainer = styled(FlexRow)``;

const ActionIconLayout = styled.div`
  &:hover {
    cursor: pointer;
  } 
`;

const FiltersContainer = styled(FlexRow)`
  justify-content: left;
`;

const FilterOptionWrapper = styled.div<{ size?: number }>`
  width: 260px;
  margin: 5px 10px 15px 0px;
`;

const mapStateToProps = (state: any) => {
  return {
    userProfile: state.userProfile,
  };
};

export default connect(
  mapStateToProps,
)(AppointmentsTable);
