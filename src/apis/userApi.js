import base from "./base";
import { USER_ENDPOINT } from "../config";

const fetchCurrentUser = async () => {
  const response = await base.api.get(`${USER_ENDPOINT}/`);
  return response;
};

const updateUser = async (
  userId,
  username,
  email,
  fullName,
  contactEmail,
  contactInstagram,
  contactMobile
) => {
  const response = await base.api.put(`${USER_ENDPOINT}/${userId}/`, {
    username,
    email,
    full_name: fullName,
    contact_email: contactEmail,
    contact_instagram: contactInstagram,
    contact_mobile: contactMobile,
  });
  return response;
};

const fetchUsersForRecommendations = async () => {
  const response = await base.api.get(
    `${USER_ENDPOINT}/fetch-users-for-recommendations/`
  );
  return response;
};

export default {
  fetchCurrentUser,
  updateUser,
  fetchUsersForRecommendations,
};
