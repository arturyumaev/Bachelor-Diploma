import React from 'react'
import { connect } from 'react-redux'
import { Table, Select, Modal, TimePicker } from 'antd';
import {
  CloseSquareTwoTone,
  ExclamationCircleOutlined,
  LoadingOutlined,
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

const { confirm } = Modal;

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
  appointments: Appointment[];
  doctors: Doctor[];
  procedures: AppointmentProcedure[];
  rooms: Room[];
}

const AppointmentsTable: React.FC<IComponentProps & StateProps> = (props) => {
  const {
    appointments,
    doctors,
    procedures,
    rooms,
  } = props;

  const showConfirm = (text: AppointmentColumnDescription, record: AppointmentColumnDescription) => {
    confirm({
      title: 'Do you want to delete appointment?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        // fetchApi(`procedure/${record.id}`, HTTPMethod.DELETE)
        //   .then(res => res.json())
        //   .then(() => loadProcedures());
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
        console.log({ text, record });

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

  const appointmentsToRender: AppointmentColumnDescription[] = appointments
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
      <Table
        columns={columns}
        dataSource={appointmentsToRender}
      />
    </Container>
  );
};

const TimeTable = styled.div`
  display: flex;
  flex-direction: row;
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
  justify-content: space-between;
`;

const FilterOptionWrapper = styled.div<{ size?: number }>`
  width: 260px;
  margin: 5px 0px 15px 0px;
`;

const mapStateToProps = (state: any) => {
  return {
    userProfile: state.userProfile,
  };
};

export default connect(
  mapStateToProps,
)(AppointmentsTable);
