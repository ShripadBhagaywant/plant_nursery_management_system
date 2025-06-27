import axiosInstance from "../axiosInstance";

// Get contacts with optional resolved status and pagination
export const getFilteredContacts = (page = 0, size = 10, resolved = "") => {
  let url = `/contacts/filter?page=${page}&size=${size}`;
  if (resolved !== "") {
    url += `&resolved=${resolved}`;
  }
  return axiosInstance.get(url);
};

// Mark a specific contact message as resolved by contact ID
export const resolveContactById = (contactId) => {
  return axiosInstance.put(`/contacts/resolve/contact/${contactId}`);
};

// Mark all messages of a user as resolved by user ID
export const resolveContactByUserId = (userId) => {
  return axiosInstance.put(`/contacts/resolve/${userId}`);
};

// Fetch all contacts (without filter or pagination)
export const getAllContacts = () => {
  return axiosInstance.get("/contacts");
};

// Delete contact by ID
export const deleteContactById = (contactId) => {
  return axiosInstance.delete(`/contacts/${contactId}`);
};
