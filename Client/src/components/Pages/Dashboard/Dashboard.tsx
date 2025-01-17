import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../../api/Api';
import getSession from '../../../utils';
import { GlobalContext } from '../../../App';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  CalendarOutlined,
  PieChartOutlined,
  UserAddOutlined,
  ProfileOutlined,
  TeamOutlined,
  ImportOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  ReconciliationOutlined,
  ForkOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import UserProfile from '../../UserProfile/UserProfile';
import Analytics from '../../Analytics';
import { connect } from 'react-redux';
import userProfileInit from '../../../store/actionCreators/userProfile/userProfileInit';
import Patients from '../../Patients/Patients';
import Doctors from '../../Doctor/Doctors';
import Locations from '../../Locations/Locations';
import Rooms from '../../Rooms/Rooms';
import Procedures from '../../Procedures/Procedures';
import Departments from '../../Departments/Departments';
import AppointmentCalendar from '../../AppointmentCalendar/AppointmentCalendar';
import Appointments from '../../Appointments/Appointments';

const { Header, Content, Sider } = Layout;

const logoutEntity: string = 'logout';
const defaultTab = 'calendar';

const Dashboard = (props: any) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const globalContext = useContext(GlobalContext);
  const toggle = () => setSidebarCollapsed(!sidebarCollapsed);

  const accessControl = props.userProfile.accessControl;

  const handleLogout = (globalContext: any) => {
    fetchApi(logoutEntity, HTTPMethod.POST, {})
      .then((response) => response.json())
      .then((json) => {
        alert('Loggout was successfull');
        globalContext.sessionUpdated();
        props.dispatch(userProfileInit());
      })
      .catch((err) => {
        alert(err);
      })
  };

  const mapTabToComponents: { [key: string]: any } = {
    profile: <UserProfile />,
    appointments: <Appointments />,
    calendar: <AppointmentCalendar />,
    procedures: <Procedures />,
    patients: <Patients />,
    doctors: <Doctors />,
    locations: <Locations />,
    rooms: <Rooms />,
    departments: <Departments />
  };

  const mapTabToName = {
    'Profile': 'Профиль',
    'Appointments': 'Записи',
    'Calendar': 'Календарь',
    'Procedures': 'Процедуры',
    'Doctors': 'Доктора',
    'Patients': 'Пациенты',
    'Rooms': 'Кабинеты',
    'Departments': 'Отделения',
    'Locations': 'Локации',
  };
 
  return getSession()
    ? (
      <Container>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={sidebarCollapsed} onCollapse={toggle}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={[defaultTab]} mode="inline">
              <Menu.Item title="Профиль" key="profile" icon={<ProfileOutlined />} onClick={() => setActiveTab('profile')}>
                Профиль
              </Menu.Item>
              <Menu.Item key="appointments" icon={<CalendarOutlined />} onClick={() => setActiveTab('appointments')}>
                Записи
              </Menu.Item>
              {(accessControl === 'Admin' || accessControl === 'Doctor') &&
                <Menu.Item key="calendar" icon={<ScheduleOutlined />} onClick={() => setActiveTab('calendar')}>
                  Календарь
                </Menu.Item>
              }
              {(accessControl === 'Admin' || accessControl === 'Doctor') &&
                <Menu.Item key="procedures" icon={<ReconciliationOutlined />} onClick={() => setActiveTab('procedures')}>
                  Процедуры
                </Menu.Item>
              }
              {(accessControl === 'Admin' || accessControl === 'Doctor') &&
                <Menu.Item key="patients" icon={<TeamOutlined />} onClick={() => setActiveTab('patients')}>
                  Пациенты
                </Menu.Item>
              }
              {accessControl === 'Admin' &&
                <Menu.Item key="doctors" icon={<UserAddOutlined />} onClick={() => setActiveTab('doctors')}>
                  Доктора
                </Menu.Item>
              }
              {accessControl === 'Admin' &&
                <Menu.Item key="locations" icon={<EnvironmentOutlined />} onClick={() => setActiveTab('locations')}>
                  Локации
                </Menu.Item>
              }
              {(accessControl === 'Admin' || accessControl === 'Doctor') &&
                <Menu.Item key="rooms" icon={<ForkOutlined />} onClick={() => setActiveTab('rooms')}>
                  Кабинеты
                </Menu.Item>
              }
              {(accessControl === 'Admin' || accessControl === 'Doctor') &&
                <Menu.Item key="departments" icon={<ApartmentOutlined />} onClick={() => setActiveTab('departments')}>
                  Отделения
                </Menu.Item>
              }
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 12 }}>
              <LogoutButtonWrapper>
                <Greeting>
                  Здравствуйте, {props.userProfile.firstName}
                </Greeting>
                <Button type="primary" onClick={() => handleLogout(globalContext)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <ImportOutlined />Выйти
                </Button>
              </LogoutButtonWrapper>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                {/* @ts-ignore */}
                <Breadcrumb.Item>{mapTabToName[(activeTab.charAt(0).toUpperCase() + activeTab.slice(1))]}</Breadcrumb.Item>
              </Breadcrumb>
              <ContentWrapper className="site-layout-background">
                {mapTabToComponents[activeTab]}
              </ContentWrapper>
            </Content>
          </Layout>
        </Layout>
      </Container>
    )
    : (
      <Redirect to='/' />
    );
};

const Container = styled.div`
  .ant-breadcrumb-link {
    font-weight: 600;
    font-size: 24px;
    line-height: 1.35;
  }
`;

const ContentWrapper = styled.div`
  min-height: 360px;
`;

const LogoutButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Greeting = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  height: 20px;
  color: white;
  margin-right: 20px;
`;

const mapStateToProps = (state: any) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps
)(Dashboard);
