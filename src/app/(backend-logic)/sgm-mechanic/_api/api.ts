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
    if (response.status === 401 || response.status === 500) {
      jwtToken = await refreshJWTToken();
      return fetchFromAPI(endpoint, options);
    }

    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

export const TestPostApi = async (
  params: { timeBegin: number; timeEnd: number; Iids: number[] },
  endpoint: string
): Promise<any> => {
  if (!jwtToken) {
    jwtToken = await getJWTToken();
  }

  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OMNICOMM_API_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleIds: params.Iids,
          timeBegin: params.timeBegin,
          timeEnd: params.timeEnd,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return null; // Возвращаем null, чтобы обработать повторный вызов
      }
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  };

  let responseData = await makeRequest(jwtToken);

  if (responseData === null) {
    jwtToken = await refreshJWTToken();
    responseData = await makeRequest(jwtToken);
  }

  return responseData;
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
