import * as Sentry from "@sentry/browser";
import mixpanel from "mixpanel-browser";
import { message } from "antd";

import userApi from "../../../services/userApi";
import locationsApi from "../../../services/locationsApi";
import destinationApi from "../../../services/destinationApi";

import routes from "../../../routes";

const fetchUser = async (setUser, setIsLoading) => {
  try {
    const response = await userApi.fetchCurrentUser();
    setUser(response);
    return response;
  } catch (error) {
    message.error(`Fetching user failed: ${error || "Connection refused"}`);
    Sentry.captureException(error);
    setIsLoading(false);
  }
};

const fetchCountries = async (setCountries, setIsLoading) => {
  try {
    const response = await locationsApi.fetchCountries();
    setCountries(response);
  } catch (error) {
    message.error(
      `Fetching countries failed: ${error || "Connection refused"}`
    );
    Sentry.captureException(error);
    setIsLoading(false);
  }
};

const fetchCities = async (country, setCities) => {
  if (country) {
    const citiesResponse = await locationsApi.fetchCities(country);
    setCities(citiesResponse);
  } else {
    setCities(null);
  }
};

const updateDestination = async (
  country,
  userCountry,
  city,
  userCity,
  user,
  countries,
  cities,
  setUpdatedDestination,
  setAreRecommendedUsersFriends,
  setUsersForRecommendations
) => {
  const countryObject = countries.find((item) => item.id === country);
  if (country !== userCountry) {
    if (!city) {
      await destinationApi.updateCurrentDestination(user?.destinations[0]?.id);
      await destinationApi.addDestination(user.id, countryObject);
    } else {
      const cityObject = cities.find((item) => item.id === city);
      await destinationApi.updateCurrentDestination(user?.destinations[0]?.id);
      await destinationApi.addDestination(user.id, countryObject, cityObject);
    }
  }
  if (country === userCountry && city !== userCity) {
    const cityObject = cities.find((item) => item.id === city);
    await destinationApi.updateCurrentDestination(user?.destinations[0]?.id);
    await destinationApi.addDestination(user.id, countryObject, cityObject);
  }
  setUpdatedDestination(countryObject.name);
  const userList = await userApi.fetchUsersForRecommendations();
  if (userList.length > 0) {
    setAreRecommendedUsersFriends(true);
    setAreRecommendedUsersFriends(userList.shift(0)["friends"]);
    setUsersForRecommendations(userList);
  }
};

const onFinish = async (
  values,
  user,
  countries,
  cities,
  setIsLoading,
  setUpdatedDestination,
  setAreRecommendedUsersFriends,
  setUsersForRecommendations
) => {
  setIsLoading(true);
  const {
    username,
    email,
    fullName,
    contactEmail,
    contactInstagram,
    contactMobile,
    country,
    city,
  } = values;
  try {
    if (
      username !== user?.username ||
      email !== user?.email ||
      fullName !== user?.full_name ||
      contactEmail !== user?.contact_email ||
      contactInstagram !== user?.contact_instagram ||
      contactMobile !== user?.contact_mobile
    ) {
      await userApi.updateUser(
        user.id,
        username,
        email,
        fullName,
        contactEmail,
        contactInstagram,
        contactMobile
      );
    }
    if (
      country !== user?.destinations[0]?.country?.id ||
      city !== user?.destinations[0]?.city?.id
    ) {
      await updateDestination(
        country,
        user?.destinations[0]?.country?.id,
        city,
        user?.destinations[0]?.city?.id,
        user,
        countries,
        cities,
        setUpdatedDestination,
        setAreRecommendedUsersFriends,
        setUsersForRecommendations
      );
    }
    mixpanel.track("You - update destination", {
      country: country,
      city: city,
    });

    setIsLoading(false);
  } catch (error) {
    message.error(`Profile update failed: ${error || "Connection refused"}`);
    Sentry.captureException(error);
    setIsLoading(false);
  }
};

const navigateToLogin = (navigate) => {
  mixpanel.track("You - clicked log out");
  navigate(routes.login);
};

export default {
  fetchUser,
  fetchCountries,
  fetchCities,
  updateDestination,
  onFinish,
  navigateToLogin,
};
