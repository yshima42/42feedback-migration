import axios, { AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { API_URL } from "./constants";
import { CAMPUS_ID_TOKYO, CURSUS_ID } from "./constants";

const UNINITIALIZED_LAST_PAGE = -1;
const PAGE_SIZE = 100;

export const fetchAllDataByAxios = async (url: string, accessToken: string) => {
  let allData: any[] = [];
  let page: number = 1;
  let lastPage: number = UNINITIALIZED_LAST_PAGE;
  const separator = url.includes("?") ? "&" : "?";

  while (true) {
    const res: AxiosResponse = await axios.get(
      `${url}${separator}page[number]=${page}&page[size]=${PAGE_SIZE}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    allData = allData.concat(res.data);

    if (lastPage === UNINITIALIZED_LAST_PAGE) {
      lastPage = Math.ceil(
        Number(res.headers["x-total"]) / Number(res.headers["x-per-page"])
      );
    }

    if (page === lastPage) {
      break;
    } else {
      page++;
    }
  }

  return allData;
};

export const fetchAccessToken = async () => {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const bodyContent = `grant_type=client_credentials&client_id=${process.env.FORTY_TWO_CLIENT_ID}&client_secret=${process.env.FORTY_TWO_CLIENT_SECRET}`;

  const reqOptions = {
    url: `${API_URL}/oauth/token`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  const response = await axios.request(reqOptions);
  const token = response.data;

  return token;
};

export const axiosRetryInSSG = async () => {
  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    retryCondition: () => true,
    onRetry: (retryCount, error) => {
      const errorMessageObject = {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        retryCount: retryCount,
      };
      console.log(`\n[Axios-retry]`);
      console.table(errorMessageObject);
    },
  });
};

export const fetchScaleTeams = async (
  projectId: string,
  accessToken: string
) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID_TOKYO}`;
  const response = await fetchAllDataByAxios(url, accessToken);

  return response;
};
