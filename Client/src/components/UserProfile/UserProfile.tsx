import React from 'react';
import styled from 'styled-components';
import getSession from '../../utils';
import { Tabs } from 'antd';
import { FormOutlined, AndroidOutlined, EllipsisOutlined } from '@ant-design/icons';
import UserProfileForm from './UserProfileForm';

const { TabPane } = Tabs;

const UserProfile = () => {
  const defaultActiveTab = 'personalInfo';
  const session = getSession();

  return (
    <Container>
      <Tabs defaultActiveKey={defaultActiveTab}>
        <TabPane tab={<span><FormOutlined />Personal info</span>} key={defaultActiveTab}>
          <UserProfileForm />
        </TabPane>
        <TabPane tab={<span><EllipsisOutlined />Other</span>} key="other">
          Page in development...
        </TabPane>
      </Tabs>
    </Container>
  );
};

const Container = styled.div``;

export default UserProfile;
