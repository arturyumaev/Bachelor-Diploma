import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import getSession from '../../utils';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { fetchApi, HTTPMethod } from '../../api/Api';
import updateUser from '../../store/actionCreators/userProfile/updateUser';

const { Option } = Select;

interface IFormField {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  component?: JSX.Element;
}

const UserProfileForm = (props: any) => {
  const session = getSession();
  const { userProfile } = props;
  const [form] = Form.useForm();

  const BaseFormFields: Array<IFormField> = [
    {
      label: 'Имя',
      name: 'firstName',
      placeholder: 'Введите имя',
      required: false,
    },
    {
      label: 'Фамилия',
      name: 'lastName',
      placeholder: 'Введите фамилию',
      required: false,
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'Введите email',
      required: false,
    },
    {
      label: 'Номер телефона',
      name: 'phone',
      placeholder: 'Введите номер телефона',
      required: false,
    },
    {
      label: 'Дата рождения',
      name: 'birthDate',
      placeholder: 'Введите дату рождения',
      required: false,
      component: <>
        <DatePicker
          defaultValue={
            form.getFieldValue('birthDate') == undefined
              ? userProfile.birthDate == ''
                  ? null
                  : moment(userProfile.birthDate)
              : form.getFieldValue('birthDate')
          }
          onChange={(date, dateString) => form.setFieldsValue({ birthDate: date })}
          style={{ width: '100%' }}
        />
      </>
    },
    {
      label: 'Пол',
      name: 'gender',
      placeholder: 'Выберите пол',
      required: false,
      component: (
        <Select
          value={userProfile.gender}
          onChange={(nextValue: string) => {
            form.setFieldsValue({ gender: nextValue });
          }}
        >
          <Option value="Male">Мужской</Option>
          <Option value="Female">Женский</Option>
          <Option value="Other">Другой</Option>
        </Select>
      ),
    },
    {
      label: 'Логин',
      name: 'username',
      placeholder: 'Введите логин',
      required: false,
    },
    {
      label: 'Пароль',
      name: 'hashsum',
      placeholder: 'Введите пароль',
      required: false,
    },
    {
      label: 'Адрес',
      name: 'address',
      placeholder: 'Введите адрес',
      required: false,
    },
  ];

  const PatientFields: Array<IFormField> = [
    {
      label: 'Экстренный случай ФИО',
      name: 'emergencyContactName',
      placeholder: 'Введите ФИО',
      required: false,
    },
    {
      label: 'Экстренный случай телефон',
      name: 'emergencyContactPhone',
      placeholder: 'Введите номер телефона',
      required: false,
    },
    {
      label: 'Экстренный случай родственник',
      name: 'emergencyContactRelation',
      placeholder: 'Введите тип родственника',
      required: false,
    },
  ];

  const handleOnFinish = () => {
    const values = {
      ...form.getFieldsValue(),
      id: props.userProfile.id,
      accessControl: props.userProfile.accessControl,
      birthDate: form.getFieldValue('birthDate') == null
        ? ''
        : moment(form.getFieldValue('birthDate')).format()
    };

    fetchApi('user', HTTPMethod.PUT, values)
      .then((response) => response.json())
      .then(json => props.dispatch(updateUser(json)));
      notification.success({ message: 'Данные успешно обновлены', duration: 3 });
  }

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...userProfile,
          birthDate: moment(userProfile.birthDate)
        }}
        onFinish={handleOnFinish}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {BaseFormFields.map((field: IFormField) => (
            <FieldWrapper key={field.name}>
              <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                {field.component
                  ? field.component
                  : <Input placeholder={field.placeholder}/>
                }
              </Form.Item>
            </FieldWrapper>
            )
          )}
          {props.userProfile.accessControl === 'Patient' &&
            PatientFields.map((field: IFormField) => (
              <FieldWrapper key={field.name}>
                <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                  <Input placeholder={field.placeholder}/>
                </Form.Item>
              </FieldWrapper>
              )
            )
          }
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Подтвердить
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  max-width: 770px;
`;

const FieldWrapper = styled.div`
  width: 350px;
  margin-right: 20px;
`;

const mapStateToProps = function(state: any) {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps
)(UserProfileForm);
