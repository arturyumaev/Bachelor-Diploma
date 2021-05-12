import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fetchApi, HTTPMethod } from '../../api/Api';
import Location from '../../interfaces/Location';
import { ICommonUser } from '../../store/reducers/userProfileReducer';
import { AppDispatch, RootState } from '../../store/store';
import LocationsTable from './LocationsTable';

type StateProps = {
  userProfile: ICommonUser;
  dispatch: AppDispatch;
}

type OwnProps = {}

const Locations: React.FC<StateProps & OwnProps> = (props) => {
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  useEffect(() => {
    setLocationsLoading(true);
    setTimeout(() => {
      fetchApi('location/-1', HTTPMethod.GET)
        .then(result => result.json())
        .then(data => setLocations(data.locations))
        .then(() => setLocationsLoading(false));
    }, 800);
  }, [dataUpdated]);

  return (
    <Container>
    <LocationsLayout>
      <LocationsTable
        locations={locations}
        locationsLoading={locationsLoading}
        loadLocations={() => setDataUpdated(!dataUpdated)}
      />
    </LocationsLayout>
  </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const LocationsLayout = styled.div``;

const mapStateToProps = (state: RootState) => {
  return {
    userProfile: state.userProfile,
  }
}

export default connect(
  mapStateToProps,
)(Locations);
