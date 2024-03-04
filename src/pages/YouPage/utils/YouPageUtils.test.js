import * as router from "react-router";

import userApi from "../../../services/userApi";
import locationsApi from "../../../services/locationsApi";
import destinationApi from "../../../services/destinationApi";

import utils from "./YouPageUtils";
import routes from "../../../routes";

import {
  mockGetCitiesForCountry1Response,
  mockGetCitiesForCountry2Response,
  mockGetCountriesReponse,
  mockGetUserReponse,
} from "../../../services/mockApiResponses";

// SPY ON / MOCK FUNCTIONS
// const updateDestinationSpy = jest
//   .spyOn(utils, "updateDestination")
//   .mockResolvedValue({});
// 3rd party
jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
const navigate = jest.fn();
// User api
const fetchCurrentUserSpy = jest
  .spyOn(userApi, "fetchCurrentUser")
  .mockResolvedValue(mockGetUserReponse);
const updateUserSpy = jest.spyOn(userApi, "updateUser").mockResolvedValue({});
const fetchUsersForRecommendationsSpy = jest
  .spyOn(userApi, "fetchUsersForRecommendations")
  .mockResolvedValue([]);
// Location api
const fetchCountriesSpy = jest
  .spyOn(locationsApi, "fetchCountries")
  .mockResolvedValue(mockGetCountriesReponse);
const fetchCitiesSpy = jest
  .spyOn(locationsApi, "fetchCities")
  .mockResolvedValue(mockGetCitiesForCountry1Response);
// Destination api
const addDestinationSpy = jest
  .spyOn(destinationApi, "addDestination")
  .mockResolvedValue({});
const updateCurrentDestinationSpy = jest
  .spyOn(destinationApi, "updateCurrentDestination")
  .mockResolvedValue({});

const user = mockGetUserReponse;
const setIsLoading = jest.fn();
const countries = mockGetCountriesReponse;
const cities = mockGetCitiesForCountry1Response;
const setUpdatedDestination = jest.fn();
const setAreRecommendedUsersFriends = jest.fn();
const setUsersForRecommendations = jest.fn();

const initialValues = {
  username: mockGetUserReponse.username,
  email: mockGetUserReponse.email,
  fullName: mockGetUserReponse.full_name,
  contactEmail: mockGetUserReponse.contact_email,
  contactInstagram: mockGetUserReponse.contact_instagram,
  contactMobile: mockGetUserReponse.contact_mobile,
  country: mockGetCountriesReponse[0].id,
  city: mockGetCitiesForCountry1Response[0].id,
};

describe.skip("YouPageUtils works as expected", () => {
  describe("fetchUser", () => {
    it("should fetch user", async () => {
      const setUser = jest.fn();
      const setIsLoading = jest.fn();
      await utils.fetchUser(setUser, setIsLoading);
      expect(fetchCurrentUserSpy).toHaveBeenCalledTimes(1);
      expect(setUser).toHaveBeenCalledWith(mockGetUserReponse);
    });
  });
  describe("fetchCountries", () => {
    it("should fetch countries", async () => {
      const setCountries = jest.fn();
      await utils.fetchCountries(setCountries);
      expect(fetchCountriesSpy).toHaveBeenCalledTimes(1);
      expect(setCountries).toHaveBeenCalledWith(mockGetCountriesReponse);
    });
  });
  describe("fetchCities", () => {
    it("should fetch cities", async () => {
      const setCities = jest.fn();
      await utils.fetchCities(mockGetCountriesReponse[0].id, setCities);
      expect(fetchCitiesSpy).toHaveBeenCalledTimes(1);
      expect(setCities).toHaveBeenCalledWith(mockGetCitiesForCountry1Response);
    });
  });
  describe("onFinish", () => {
    it("should not update user if user has not changed details", async () => {
      await utils.onFinish(
        initialValues,
        user,
        countries,
        cities,
        setIsLoading,
        setUpdatedDestination,
        setAreRecommendedUsersFriends,
        setUsersForRecommendations
      );
      expect(updateUserSpy).not.toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
    it("should update user if user has changed details", async () => {
      initialValues.username = "test changed username";
      await utils.onFinish(
        initialValues,
        user,
        countries,
        cities,
        setIsLoading,
        setUpdatedDestination,
        setAreRecommendedUsersFriends,
        setUsersForRecommendations
      );
      expect(updateUserSpy).toHaveBeenCalledTimes(1);
      expect(updateUserSpy).toHaveBeenCalledWith(
        mockGetUserReponse.id,
        initialValues.username,
        initialValues.email,
        initialValues.fullName,
        initialValues.contactEmail,
        initialValues.contactInstagram,
        initialValues.contactMobile
      );
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
    it("should not updateDestination if only user details have changed", async () => {
      await utils.onFinish(
        initialValues,
        user,
        countries,
        cities,
        setIsLoading,
        setUpdatedDestination,
        setAreRecommendedUsersFriends,
        setUsersForRecommendations
      );
      expect(addDestinationSpy).not.toHaveBeenCalled();
      expect(updateCurrentDestinationSpy).not.toHaveBeenCalled();
    });
    it("should call updateDestination if user location has been updated", async () => {
      initialValues.country = mockGetCountriesReponse[1].id;
      initialValues.city = mockGetCitiesForCountry2Response[0].id;
      await utils.onFinish(
        initialValues,
        user,
        countries,
        cities,
        setIsLoading,
        setUpdatedDestination,
        setAreRecommendedUsersFriends,
        setUsersForRecommendations
      );
      //   TODO george fix this to just expect updateDestination()
      // expect(updateDestinationSpy).toHaveBeenCalled();
      expect(addDestinationSpy).toHaveBeenCalled();
      expect(updateCurrentDestinationSpy).toHaveBeenCalled();
      expect(fetchUsersForRecommendationsSpy).toHaveBeenCalled();
    });
  });
  describe.skip("updateDestination", () => {
    it("should update destination", async () => {
      const country = mockGetCountriesReponse[1].id;
      const userCountry = mockGetUserReponse.destinations[0].country.id;
      const city = mockGetCitiesForCountry2Response[0].id;
      const userCity = mockGetUserReponse.destinations[0].city.id;
      await utils.updateDestination(
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
      );
      expect(addDestinationSpy).toHaveBeenCalledTimes(1);
      expect(updateCurrentDestinationSpy).toHaveBeenCalledTimes(1);
      expect(fetchUsersForRecommendationsSpy).toHaveBeenCalledTimes(1);
      expect(setUpdatedDestination).toHaveBeenCalledWith(
        mockGetCountriesReponse[1].name
      );
    });
  });
  describe("navigateToLogin", () => {
    it("should navigate to login", () => {
      utils.navigateToLogin(navigate);
      expect(navigate).toHaveBeenCalledWith(routes.login);
    });
  });
});
