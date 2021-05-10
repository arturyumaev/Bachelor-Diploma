import React, { useState, useEffect } from 'react';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Doctor from '../../interfaces/Doctor';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { AppDispatch } from '../../store/store';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Doctors: React.FC<OwnProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [doctosLoading, setDoctorsLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  useEffect(() => {
    setDoctorsLoading(true);
    setTimeout(() => {
      fetchApi('user/doctor/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setDoctors(data.doctors))
        .then(() => setDoctorsLoading(false));
    }, 1000);
  }, [dataUpdated]);

  console.log(doctors);

  return (
    <div>
      Doctors content
    </div>
  );
};

export default Doctors;