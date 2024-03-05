import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import mixpanel from "mixpanel-browser";

import YouPageForm from "./components/YouPageForm";
import utils from "./utils/YouPageUtils";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const YouPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //   TODO george add to redux
  const [countries, setCountries] = useState(null);
  const [cities, setCities] = useState(null);
  const [useSharingQr, setUseSharingQr] = useState(true);
  const [usersForRecommendations, setUsersForRecommendations] = useState([]);
  const [updatedDestination, setUpdatedDestination] = useState(null);
  const [areRecommendedUsersFriends, setAreRecommendedUsersFriends] =
    useState(false);

  useEffect(() => {
    mixpanel.track("You - page view");
    // TODO george add info to redux upon sign in / initial load
    utils.fetchUser(setUser, setIsLoading).then((user) => {
      utils.fetchCountries(setCountries, setIsLoading);
      user.destinations &&
        utils.fetchCities(user.destinations[0].country.id, setCities);
    });
    setIsLoading(false);
  }, []);

  return (
    <YouPageForm
      navigateToLogin={() => utils.navigateToLogin(navigate)}
      onFinish={(values) =>
        utils.onFinish(
          values,
          user,
          countries,
          cities,
          setIsLoading,
          setUpdatedDestination,
          setAreRecommendedUsersFriends,
          setUsersForRecommendations
        )
      }
      isLoading={isLoading}
      user={user}
      countries={countries}
      cities={cities}
      fetchCities={(country) => utils.fetchCities(country, setCities)}
      useSharingQr={useSharingQr}
      setUseSharingQr={setUseSharingQr}
      usersForRecommendations={usersForRecommendations}
      updatedDestination={updatedDestination}
      areRecommendedUsersFriends={areRecommendedUsersFriends}
      tailFormItemLayout={tailFormItemLayout}
    />
  );
};

export default YouPage;
