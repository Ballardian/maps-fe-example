// This would contain mock responses for all of the api calls in the application
// This means the FE can develop without needing to wait for the BE to be ready
// This is also useful for onboarding new FE engineers
// TODO george investigate adding MSW to this project

const mockGetCountriesReponse = [
  { id: 1, name: "test_country" },
  { id: 2, name: "test_country2" },
  { id: 3, name: "test_country3" },
];
const mockGetCitiesForCountry1Response = [
  { id: 1, name: "test_city", country: 1 },
  { id: 2, name: "test_city2", country: 1 },
];
const mockGetCitiesForCountry2Response = [
  { id: 3, name: "test_city3", country: 2 },
];
const mockGetUserReponse = {
  id: 1,
  full_name: "test name",
  email: "test@email.com",
  username: "test_username",
  contact_email: "test_contact_email@email.com",
  contact_instagram: "test_contact_instagram",
  contact_mobile: "test_contact_mobile",
  destinations: [
    {
      id: 1,
      country: { id: 1, name: "test_country" },
      city: { id: 1, name: "test_city", country: 1 },
    },
  ],
  uuid: "test_uuid",
};

export {
  mockGetCountriesReponse,
  mockGetCitiesForCountry1Response,
  mockGetCitiesForCountry2Response,
  mockGetUserReponse,
};
