"use server";

let jwtToken: string | null = null;
let refreshToken: string | null = null;

export const fetchFromAPI = async (endpoint: string, options?: RequestInit) => {
  if (!jwtToken) {
    jwtToken = await getJWTToken();
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_OMNICOMM_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `JWT ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      jwtToken = await refreshJWTToken();
      return fetchFromAPI(endpoint, options);
    }
    console.log(await response);

    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

const getJWTToken = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_OMNICOMM_API_URL}/auth/login?jwt=1`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: `imperiya`,
        password: `sgmkz2030`,
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  jwtToken = data.jwt;
  refreshToken = data.refresh;

  try {
    return jwtToken;
  } catch (error) {
    throw new Error("Failed to parse JSON");
  }
};

const refreshJWTToken = async () => {
  if (!refreshToken) throw new Error("Отсутвует refresh токен");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_OMNICOMM_API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        Authorization: `${refreshToken}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh JWT token");
  }
  const data = await response.json();
  jwtToken = data.jwt;
  return jwtToken;
};
