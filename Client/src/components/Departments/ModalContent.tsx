import { Form } from 'antd';
import React from 'react';
import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';

interface IFormField {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  component?: JSX.Element;
}

interface IComponentProps {
  onSubmit: (data: object) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}

const tempDepartmentInitial = {
  name: '',
}

export const ModalContent: React.FC<IComponentProps> = (props) => {
  const { onSubmit, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();

  const departmentFormFields: Array<IFormField> = [
    {
      label: 'Name',
      name: 'name',
      placeholder: 'Input department name',
      required: true,
    },
  ];

  const handleFinish = () => {
    const dataToSubmit = form.getFieldsValue();
    onSubmit(dataToSubmit);
    form.resetFields();
  }

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  }

  return (
    <Container>
      <Form
        form={form}
        layout="vertical"
        initialValues={tempDepartmentInitial}
        onFinish={() => handleFinish()}
      >
        <Wrapper>
          {departmentFormFields.map((field: IFormField) => (
            <FieldWrapper key={field.name}>
              <Form.Item name={field.name} label={field.label} rules={[{ required: field.required }]} key={field.name}>
                {field.component
                  ? field.component
                  : <Input disabled={confirmLoading} placeholder={field.placeholder}/>
                }
              </Form.Item>
            </FieldWrapper>
            )
          )}
        </Wrapper>
        <Form.Item>
          <ButtonWrapper>
            <Button disabled={confirmLoading} type="primary" htmlType="submit">
              {confirmLoading
                ? <><Spin />&nbsp;Loading...</>
                : <>Create</>
              }
            </Button>
            <Button style={{ marginRight: '8px' }} onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonWrapper>
        </Form.Item>
      </Form>
    </Container>
  );
};

const Flex = styled.div`
  display: flex;
`;

const Container = styled.div`
  
`;

const Wrapper = styled(Flex)`
  flex-wrap: wrap;
`;

const ButtonWrapper = styled(Flex)`
  flex-direction: row-reverse;
`;

const FieldWrapper = styled.div`
  width: 100%;
  margin-right: 20px;
`;
