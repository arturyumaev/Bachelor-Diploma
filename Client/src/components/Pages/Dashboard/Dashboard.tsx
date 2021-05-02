import React, { createContext, useContext, useState } from 'react';
import { Button } from 'antd';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../../api/Api';
import getSession from '../../../utils';
import { GlobalContext } from '../../../App';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserAddOutlined,
  ProfileOutlined,
  UserOutlined,
  ImportOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import UserProfile from '../../UserProfile/UserProfile';
import Analytics from '../../Analytics';
import { connect } from 'react-redux';
import userProfileInit from '../../../store/actionCreators/userProfile/userProfileInit';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const logoutEntity: string = 'logout';

const Dashboard = (props: any) => {
  const defaultTab = 'dashboard';
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const globalContext = useContext(GlobalContext);
  const toggle = () => setSidebarCollapsed(!sidebarCollapsed);

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
    dashboard: <Analytics />,
    profile: <UserProfile />,
    appointments: <>appointments</>,
    patients: <>patients</>,
    doctors: <>doctors</>,
    locations: <>Locations</>,
  };
 
  return getSession()
    ? (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={sidebarCollapsed} onCollapse={toggle}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={[defaultTab]} mode="inline">
              <Menu.Item key="dashboard" icon={<PieChartOutlined />} onClick={() => setActiveTab('dashboard')}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="profile" icon={<ProfileOutlined />} onClick={() => setActiveTab('profile')}>
                Profile
              </Menu.Item>
              <Menu.Item key="appointments" icon={<DesktopOutlined />} onClick={() => setActiveTab('appointments')}>
                Appointments
              </Menu.Item>
              <Menu.Item key="patients" icon={<UserOutlined />} onClick={() => setActiveTab('patients')}>
                Patients
              </Menu.Item>
              <Menu.Item key="doctors" icon={<UserAddOutlined />} onClick={() => setActiveTab('doctors')}>
                Doctors
              </Menu.Item>
              <Menu.Item key="locations" icon={<EnvironmentOutlined />} onClick={() => setActiveTab('locations')}>
                Locations
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 12 }}>
              <LogoutButtonWrapper>
                <Button type="primary" onClick={() => handleLogout(globalContext)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <ImportOutlined />Logout
                </Button>
              </LogoutButtonWrapper>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Breadcrumb.Item>
              </Breadcrumb>
              <ContentWrapper className="site-layout-background">
                {mapTabToComponents[activeTab]}
              </ContentWrapper>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </div>
    )
    : (
      <Redirect to='/' />
    );
};

const ContentWrapper = styled.div`
  min-height: 360px;
`;

const LogoutButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const mapStateToProps = (state: any) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps
)(Dashboard);
