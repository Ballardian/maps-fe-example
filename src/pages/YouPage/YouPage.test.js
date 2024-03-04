import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import YouPage from "./index";
import utils from "./utils/YouPageUtils";

import userApi from "../../services/userApi";
import locationsApi from "../../services/locationsApi";

import { dataTestIds, sectionHeaders, buttonText } from "./constants";
import {
  mockGetCitiesForCountry1Response,
  mockGetCountriesReponse,
  mockGetUserReponse,
} from "../../services/mockApiResponses";

// SPY ON / MOCK FUNCTIONS
// Apis
const fetchCurrentUserSpy = jest
  .spyOn(userApi, "fetchCurrentUser")
  .mockResolvedValue(mockGetUserReponse);
const fetchCountriesSpy = jest
  .spyOn(locationsApi, "fetchCountries")
  .mockResolvedValue(mockGetCountriesReponse);
const fetchCitiesSpy = jest
  .spyOn(locationsApi, "fetchCities")
  .mockResolvedValue(mockGetCitiesForCountry1Response);
// Utils
const onFinishSpy = jest.spyOn(utils, "onFinish").mockResolvedValue({});
const navigateToLogin = jest
  .spyOn(utils, "navigateToLogin")
  .mockResolvedValue({});

// Fields
describe.skip("YouPage renders correctly", () => {
  it("should render headings correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      expect(screen.getByText(sectionHeaders.contact)).toBeInTheDocument();
      //   eslint error discussed here - https://github.com/testing-library/eslint-plugin-testing-library/discussions/595
      expect(screen.getByText(sectionHeaders.uniqueLink)).toBeInTheDocument();
      expect(screen.getByText(sectionHeaders.regLink)).toBeInTheDocument();
    });
  });
  it("should make initial api calls correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      expect(fetchCurrentUserSpy).toHaveBeenCalled();
      expect(fetchCountriesSpy).toHaveBeenCalled();
      expect(fetchCitiesSpy).toHaveBeenCalled();
    });
  });
  it("should populate user fields correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      // full name
      const fullNameField = screen.getByTestId(dataTestIds.fullName);
      expect(fullNameField).toBeInTheDocument();
      expect(fullNameField).toHaveValue(mockGetUserReponse.full_name);

      // email
      const emailField = screen.getByTestId(dataTestIds.email);
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue(mockGetUserReponse.email);

      // username
      const usernameField = screen.getByTestId(dataTestIds.username);
      expect(usernameField).toBeInTheDocument();
      expect(usernameField).toHaveValue(mockGetUserReponse.username);
    });
  });
  it("should populate contact fields correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      const contactEmailField = screen.getByTestId(dataTestIds.contactEmail);
      const contactInstagramField = screen.getByTestId(
        dataTestIds.contactInstagram
      );
      const contactNumberField = screen.getByTestId(dataTestIds.contactNumber);
      expect(contactEmailField).toHaveValue(mockGetUserReponse.contact_email);
      expect(contactInstagramField).toHaveValue(
        mockGetUserReponse.contact_instagram
      );
      expect(contactNumberField).toHaveValue(mockGetUserReponse.contact_mobile);
    });
  });
  it("should populate location fields correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      const userLocationCountry = screen.getByTestId(dataTestIds.userCountry);
      const userLocationCity = screen.getByTestId(dataTestIds.userCity);
      expect(userLocationCountry).toBeInTheDocument();
      expect(userLocationCity).toBeInTheDocument();
      expect(
        within(userLocationCountry).getByText(
          mockGetUserReponse.destinations[0].country.name
        )
      ).toBeInTheDocument();
      expect(
        within(userLocationCity).getByText(
          mockGetUserReponse.destinations[0].city.name
        )
      ).toBeInTheDocument();
    });
  });
  it("should render buttons correctly", async () => {
    render(<YouPage />);
    await waitFor(() => {
      const updateBtn = screen.getByTestId(dataTestIds.updateBtn);
      const logOutBtn = screen.getByTestId(dataTestIds.logOutBtn);
      expect(updateBtn).toBeInTheDocument();
      expect(logOutBtn).toBeInTheDocument();
      updateBtn.textContent = buttonText.update;
      logOutBtn.textContent = buttonText.logOut;
    });
  });
});

// Buttons
describe("YouPage interactions work correctly", () => {
  describe.skip("user can update their location", () => {
    it("should open dropdown containing all countries when user clicks country location field", async () => {
      render(<YouPage />);
      await waitFor(() => {
        expect(screen.getByTestId(dataTestIds.userCountry)).toBeInTheDocument();
      });
      const selectCountryField = screen.getByTestId(dataTestIds.userCountry);
      fireEvent.mouseDown(selectCountryField.firstElementChild);
      for (let i = 0; i < mockGetCountriesReponse.length; i++) {
        expect(
          screen.getByTestId(
            `${dataTestIds.option}-country${mockGetCountriesReponse[i].id}`
          )
        ).toBeInTheDocument();
      }
    });
    it("should update the country location field correctly when a new location is selected from the dropdown", async () => {
      render(<YouPage />);
      await waitFor(() => {
        expect(screen.getByTestId(dataTestIds.userCountry)).toBeInTheDocument();
      });
      const selectCountryField = screen.getByTestId(dataTestIds.userCountry);
      // Check the location field has the correct initial country
      expect(
        within(selectCountryField).getByText(
          mockGetUserReponse.destinations[0].country.name
        )
      ).toBeInTheDocument();

      fireEvent.mouseDown(selectCountryField.firstElementChild);
      fireEvent.click(
        screen.getByTestId(
          `${dataTestIds.option}-country${mockGetCountriesReponse[1].id}`
        )
      );
      await waitFor(() => {
        const selectCountryField = screen.getByTestId(dataTestIds.userCountry);
        // Check the location field has updated to new country
        expect(
          within(selectCountryField).getByText(mockGetCountriesReponse[1].name)
        ).toBeInTheDocument();
      });
    });
    // it("user can click on city location input and it will open dropdown containing all relevant cities", async () => {
    //   render(<YouPage />);
    //   await waitFor(() => {
    //     const selectCityField = screen.getByTestId(dataTestIds.userCity);
    //     expect(selectCityField).toBeInTheDocument();
    //   });
    //   const location_city_input = screen.getByTestId(
    //     dataTestIds.userCity
    //   ).firstElementChild;
    //   fireEvent.mouseDown(location_city_input);
    //   for (let i = 0; i < mockGetCitiesForCountry1Response.length; i++) {
    //     expect(
    //       screen.getByTestId(
    //         `${dataTestIds.option}-city${mockGetCitiesForCountry1Response[i].id}`
    //       )
    //     ).toBeInTheDocument();
    //   }
    // });
  });
  describe.skip("user can switch between qr clode and link", () => {
    it("should switch between sharing via QR code or via link when toggle is clicked", async () => {
      render(<YouPage />);
      await waitFor(() => {
        const sharingCodeSwitchField = screen.getByTestId(
          dataTestIds.sharingCodeSwitch
        );
        expect(sharingCodeSwitchField).toBeInTheDocument();
        expect(screen.queryByTestId(dataTestIds.sharingLink)).toBeNull();
        expect(
          screen.getByTestId(dataTestIds.sharingQrCode)
        ).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId(dataTestIds.sharingCodeSwitch));
      expect(screen.getByTestId(dataTestIds.sharingLink)).toBeInTheDocument();
      expect(screen.queryByTestId(dataTestIds.sharingQrCode)).toBeNull();
    });
    it("should switch back from sharing via link to via QR code when toggle is clicked again", async () => {
      render(<YouPage />);
      await waitFor(() => {
        const sharingCodeSwitchField = screen.getByTestId(
          dataTestIds.sharingCodeSwitch
        );
        expect(sharingCodeSwitchField).toBeInTheDocument();
        expect(screen.queryByTestId(dataTestIds.sharingLink)).toBeNull();
        expect(
          screen.getByTestId(dataTestIds.sharingQrCode)
        ).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId(dataTestIds.sharingCodeSwitch));
      expect(screen.getByTestId(dataTestIds.sharingLink)).toBeInTheDocument();
      expect(screen.queryByTestId(dataTestIds.sharingQrCode)).toBeNull();
      // Click back to QR code
      fireEvent.click(screen.getByTestId(dataTestIds.sharingCodeSwitch));
      expect(screen.getByTestId(dataTestIds.sharingQrCode)).toBeInTheDocument();
      expect(screen.queryByTestId(dataTestIds.sharingLink)).toBeNull();
    });
  });
  describe("user can submit changes", () => {
    it("should fire onFinish util when update button is clicked", async () => {
      render(<YouPage />);
      const updateBtn = screen.getByTestId(dataTestIds.updateBtn);
      expect(updateBtn).toBeInTheDocument();
      fireEvent.submit(updateBtn);
      await waitFor(() => {
        expect(onFinishSpy).toHaveBeenCalled();
      });
    });
    // TODO write tests for errors maybe?
  });
  describe("user can logout", () => {
    it("should fire navigateToLogin util when logout button is clicked", async () => {
      render(<YouPage />);
      const logOutBtn = screen.getByTestId(dataTestIds.logOutBtn);
      expect(logOutBtn).toBeInTheDocument();
      fireEvent.click(logOutBtn);
      await waitFor(() => {
        expect(navigateToLogin).toHaveBeenCalled();
      });
    });
  });
});
