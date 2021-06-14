import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Select, Tag, Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';
import styled from 'styled-components';
import Doctor from '../../interfaces/Doctor';
import AppointmentProcedure from '../../interfaces/Appointment/AppointmentProcedure';
import { Department } from '../../interfaces/Department';
import { fetchApi, HTTPMethod } from '../../api/Api';
import { AppointmentForm, IAppointmentData } from './AppointmentForm';
import Location from '../../interfaces/Location';
import Appointment from '../../interfaces/Appointment/Appointment';
import Patient from '../../interfaces/Patient';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { IState } from '../../store/reducers/selectedDoctor';
import updateDoctor from '../../store/actionCreators/userProfile/updateSelectedDoctor';
import { ICommonUser } from '../../store/reducers/userProfileReducer';

const { Option } = Select;
const localizer = momentLocalizer(moment);

const defaultAppointmentData: IAppointmentData = {
  doctorId: -1,
  departmentId: -1,
  procedureId: -1,
  from: new Date(),
  to: new Date(),
}

export const convertMinsToHrsMins = (mins?: number) => {
  if (mins) {
    let h: any = Math.floor(mins / 60);
    let m: any = mins % 60;
    // h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}h ${m}m`;
  }
}

const fetchAppointments = (doctorId: number) => {
  return fetchApi(`appointment/doctor/${doctorId}`, HTTPMethod.GET);
}

export interface CalendarEvent {
  id: number;
  start: Date;
  end: Date;
  created: string;

  doctorId: number;
  patientId: number;
  procedureId: number;
  roomId: number;
  title: string;
  notes: string;
}

type StateProps = {
  selectedDoctor: IState;
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const AppointmentCalendar: React.FC<OwnProps & StateProps> = (props) => {
  const { selectedDoctor, userProfile, dispatch } = props;
  const accessRole = userProfile.accessControl;

  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorsRecieved, setDoctorsRecieved] = useState<boolean>(false);
  
  const [procedures, setProcedures] = useState<Array<AppointmentProcedure>>([]);
  const [proceduresRecieved, setProceduresRecieved] = useState<boolean>(false);
  
  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [departmentsRecieved, setDepartmentsRecieved] = useState<boolean>(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsRecieved, setLocationsRecieved] = useState<boolean>(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsRecieved, setPatientsRecieved] = useState<boolean>(false);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(
    accessRole == 'Doctor'
      ? userProfile.departmentId
      : selectedDoctor.departmentId
  );
  const [selectedDoctortId, setSelectedDoctorId] = useState<number | undefined>(
    accessRole == 'Doctor'
      ? userProfile.id
      : selectedDoctor.doctorId
  );
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | undefined>(undefined);

  const [appointmentData, setAppointmentData] = useState<IAppointmentData>(defaultAppointmentData);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  
  const [appointmentDescrModalOpen, setAppointmentDescrModalOpen] = useState<boolean>(false);
  const [editAppointmentData, setEditAppointmentData] = useState<CalendarEvent>({} as CalendarEvent);

  const [loadAppointments, setLoadAppointments] = useState<boolean>(false);

  useEffect(() => {
    if (!doctorsRecieved) {
      fetchApi('user/doctor/-1', HTTPMethod.GET)
        .then((result) => { setDoctorsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setDoctors(data.doctors));
    }

    if (!proceduresRecieved) {
      fetchApi('procedure/-1', HTTPMethod.GET)
        .then((result) => { setProceduresRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setProcedures(data.procedures));
    }

    if (!departmentsRecieved) {
      fetchApi('department/-1', HTTPMethod.GET)
        .then((result) => { setDepartmentsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setDepartments(data.departments));
    }

    if (!locationsRecieved) {
      fetchApi('location/-1', HTTPMethod.GET)
        .then((result) => { setLocationsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setLocations(data.locations));
    }

    if (!patientsRecieved) {
      fetchApi('user/patient/-1', HTTPMethod.GET)
        .then((result) => { setPatientsRecieved(true); return result; })
        .then(result => result.json())
        .then(data => setPatients(data.patients));
    }
  }, []);

  useEffect(() => {
    if (selectedProcedureId) {
      setOpenModal(true);
    }
  }, [appointmentData]);

  useEffect(() => {
    if (selectedDoctortId) {
      fetchAppointments(selectedDoctortId)
        .then(res => res.json())
        .then(data => setDoctorAppointments(data.appointments));
    } else {
      setDoctorAppointments([]);
    }
  }, [selectedDoctortId]);

  useEffect(() => {
    if (selectedDoctortId && loadAppointments) {
      fetchAppointments(selectedDoctortId)
        .then(res => res.json())
        .then(data => setDoctorAppointments(data.appointments))
        .then(() => setLoadAppointments(false));
    }
  }, [loadAppointments]);

  const handleModalSubmit = (values: any) => {
    const appointmentData = {
      ...values,
      created: '',
    }
    fetchApi('appointment', HTTPMethod.POST, appointmentData);

    if (selectedDoctortId) {
      fetchAppointments(selectedDoctortId)
        .then(res => res.json())
        .then(data => setDoctorAppointments(data.appointments))
        .then(() => setOpenModal(false));
    }
  };

  const handleDeleteAppointment = () => {
    fetchApi(`appointment/${editAppointmentData.id}`, HTTPMethod.DELETE)
      .then(res => res.json())
      .then(() => {
        setAppointmentDescrModalOpen(false);
        setEditAppointmentData({} as CalendarEvent);
        setLoadAppointments(true);
      })
  };

  return (
    <Container>
      <FiltersContainer>
        <FilterOptionWrapper>
          <Select
            value={selectedDepartmentId}
            disabled={accessRole == 'Doctor'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите отделение"
            optionFilterProp="children"
            onChange={(value: number, option: any) => {
              setSelectedDepartmentId(value);
              
              setSelectedDoctorId(undefined);
              dispatch(updateDoctor({ doctorId: undefined, departmentId: undefined }));

              setSelectedProcedureId(undefined);
            }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
          </Select>
        </FilterOptionWrapper>
        <FilterOptionWrapper>
          <Select
            value={selectedDoctortId}
            disabled={accessRole == 'Doctor'}
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="Выберите доктора"
            optionFilterProp="children"
            onChange={(value: number, option: any) => {
              setSelectedDoctorId(value);
              dispatch(updateDoctor({ doctorId: value, departmentId: doctors.find(d => d.id == value)?.departmentId }));
              setSelectedProcedureId(undefined);
              if (value) {
                setSelectedDepartmentId(doctors.filter(d => d.id == value)[0].departmentId);
              }
            }}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(selectedDepartmentId
                ? doctors.filter(d => d.departmentId == selectedDepartmentId)
                : doctors
              ).map(d => <Option key={d.id} value={d.id}>{`${d.firstName} ${d.lastName}`}</Option>)
            }
          </Select>
        </FilterOptionWrapper>
        {accessRole == 'Admin' &&
          <>
            <FilterOptionWrapper width={350}>
              <Select
                disabled={!selectedDoctortId}
                value={selectedProcedureId}
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Выберите процедуру"
                optionFilterProp="children"
                onChange={(value: number, option: any) => {
                  setSelectedProcedureId(value);
                }}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(selectedDoctortId
                    ? procedures.filter(p => p.doctorId == selectedDoctortId)
                    : procedures
                  ).map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
              </Select>
            </FilterOptionWrapper>
            <FilterOptionWrapper>
              <Tag color={!!selectedProcedureId ? '#87d068' : '#f50'}>
                {!!selectedProcedureId
                  ? <>Продолж.: {convertMinsToHrsMins(procedures.find(p => p.id == selectedProcedureId)?.duration)}</>
                  : (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <InfoCircleOutlined />
                      &nbsp;
                      Выберите процедуру
                    </div>
                  )
                }
              </Tag>
            </FilterOptionWrapper>
          </>
        }
      </FiltersContainer>
      <Calendar
        selectable={!!selectedProcedureId && accessRole == 'Admin'}
        onSelectEvent={(e) => {
          setEditAppointmentData(e);
          setAppointmentDescrModalOpen(true);
        }}
        culture="ru-RU"
        messages={{
          next: 'След',
          previous: 'Пред',
          today: 'Сегодня',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День',
          agenda: 'Ежедневник'
        }}
        defaultView={'week'}
        localizer={localizer}
        events={doctorAppointments.map(app => {
          const patient = patients.find(p => p.id == app.patientId);
          return {
            title: `${patient?.firstName} ${patient?.lastName}`,
            start: new Date(app.scheduledTime),
            end: new Date(app.scheduledEndTime),
            id: app.id,
            patientId: app.patientId,
            procedureId: app.appointmentProcedureId,
            doctorId: app.doctorId,
            roomId: app.roomId,
            notes: app.notes,
            created: app.created,
          } as CalendarEvent;
        })}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2021, 4, 1, 8, 30)}
        max={new Date(2021, 4, 1, 18, 0)}
        onSelectSlot={(slotInfo) => {
          setAppointmentData({
            doctorId: selectedDoctortId ?? -1,
            procedureId: selectedProcedureId ?? -1,
            departmentId: selectedDepartmentId ?? -1,
            from: new Date(slotInfo.start),
            to: new Date(slotInfo.end),
          });
        }}
      />
      <Modal
        title="Новая запись"
        width={700}
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        destroyOnClose={true}
        footer={
          [
            <Button form="appointmentForm" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>,
            <Button type="primary" form="appointmentForm" key="submit" htmlType="submit">
              Submit
            </Button>
          ]
        }
      >
        <AppointmentForm
          {...appointmentData}
          readonly={false}
          departments={departments}
          procedures={procedures}
          doctors={doctors}
          locations={locations}
          onSubmit={handleModalSubmit}
        />
      </Modal>
      <Modal
        title="Appointment"
        width={700}
        visible={appointmentDescrModalOpen}
        onCancel={() => setAppointmentDescrModalOpen(false)}
        destroyOnClose={true}
        footer={
          [
            <Button form="appointmentForm" onClick={() => setAppointmentDescrModalOpen(false)}>
              Отмена
            </Button>,
            <Button disabled={accessRole !== 'Admin'} type="primary" danger onClick={handleDeleteAppointment}>
              Удалить
            </Button>
          ]
        }
      >
        <AppointmentForm
          {...appointmentData}
          readonly
          departments={departments}
          procedures={procedures}
          doctors={doctors}
          locations={locations}
          onSubmit={handleModalSubmit}
          appointment={editAppointmentData}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  height: 70vh;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`;

const FilterOptionWrapper = styled.div<{ width?: number }>`
  width: ${({ width }) => width ?? 260}px;
  margin: 5px 10px 15px 0px;
`;

const mapStateToProps = (state: RootState) => {
  return {
    selectedDoctor: state.selectedDoctor,
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(AppointmentCalendar);
