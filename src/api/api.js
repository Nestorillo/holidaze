const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "a86d0390-e249-4c5c-b618-c31098b03aff";

export function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return await response.json();
}

export async function loginUser(userData) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return await response.json();
}

export async function getVenues() {
  const response = await fetch(`${API_BASE}/holidaze/venues?limit=60`, {
    headers: getHeaders(),
  });

  return await response.json();
}

export async function getVenueById(id) {
  const response = await fetch(
    `${API_BASE}/holidaze/venues/${id}?_bookings=true`,
    {
      headers: getHeaders(),
    }
  );

  return await response.json();
}

export async function createBooking(data) {
  const response = await fetch(`${API_BASE}/holidaze/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function createVenue(data) {
  const response = await fetch(`${API_BASE}/holidaze/venues`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return await response.json();
}

/* 🔥 FIX IMPORTANTE */
export async function getProfile(name, query = "") {
  const response = await fetch(
    `${API_BASE}/holidaze/profiles/${name}${query}`,
    {
      headers: getHeaders(),
    }
  );

  return await response.json();
}

export async function deleteVenue(id) {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return res;
}
export async function updateVenue(id, data) {
  const response = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return await response.json();
}
export async function getVenueWithBookings(id) {
  const response = await fetch(
    `${API_BASE}/holidaze/venues/${id}?_bookings=true`,
    {
      headers: getHeaders(),
    }
  );

  return await response.json();
}
export async function updateProfile(name, data) {
  const response = await fetch(
    `${API_BASE}/holidaze/profiles/${name}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  return await response.json();
}