import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import YouPageForm from "./YouPageForm";
import { dataTestIds } from "../constants";
import {
  mockGetCitiesForCountry1Response,
  mockGetCountriesReponse,
  mockGetUserReponse,
} from "../../../services/mockApiResponses";

// Note: only passing compulsory props for initial render testing
describe("YouPageForm renders correctly initially", () => {
  it("form renders correctly initially, with expected props", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
      />
    );
    await waitFor(() => {
      // full name
      const fullNameField = screen.getByTestId(dataTestIds.fullName);
      expect(fullNameField).toBeInTheDocument();
      expect(fullNameField).toHaveValue(mockGetUserReponse.fullName);
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
  it("form renders SharingQrCode if useSharingQr state is true", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
        useSharingQr={true}
      />
    );
    await waitFor(() => {
      const qrCodeField = screen.getByTestId(dataTestIds.sharingQrCode);
      expect(qrCodeField).toBeInTheDocument();
    });
  });
  it("form renders SharingLink if useSharingQr state is false", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
        useSharingQr={false}
      />
    );
    await waitFor(() => {
      const linkField = screen.getByTestId(dataTestIds.sharingLink);
      expect(linkField).toBeInTheDocument();
    });
  });
  it("form renders Update button", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
      />
    );
    await waitFor(() => {
      const updateButton = screen.getByTestId(dataTestIds.updateBtn);
      expect(updateButton).toBeInTheDocument();
    });
  });
  it("form renders Log Out button", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
      />
    );
    await waitFor(() => {
      const logOutButton = screen.getByTestId(dataTestIds.logOutBtn);
      expect(logOutButton).toBeInTheDocument();
    });
  });
  it("form renders country and city select fields", async () => {
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
      />
    );
    await waitFor(() => {
      const countryField = screen.getByTestId(dataTestIds.userCountry);
      expect(countryField).toBeInTheDocument();
      const cityField = screen.getByTestId(dataTestIds.userCity);
      expect(cityField).toBeInTheDocument();
    });
  });
  // TODO george move to new test case
  it("fires onFinish function when Update button is clicked", async () => {
    const onFinish = jest.fn();
    render(
      <YouPageForm
        isLoading={false}
        user={mockGetUserReponse}
        countries={mockGetCountriesReponse}
        cities={mockGetCitiesForCountry1Response}
        onFinish={onFinish}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId(dataTestIds.updateBtn)).toBeInTheDocument();
    });
    const updateButton = screen.getByTestId(dataTestIds.updateBtn);
    fireEvent.submit(updateButton);
    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
  });
});
