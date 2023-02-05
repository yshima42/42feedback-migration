import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { API_URL } from "./constants";

export const fetchAllDataByFetchAPI = async (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  let allData: any[] = [];
  let nextPageUrl: RequestInfo | URL | undefined = input;

  while (nextPageUrl) {
    const res: Response = await fetch(nextPageUrl, init);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    allData = allData.concat(data);
    nextPageUrl = res.headers
      .get("link")
      ?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }

  return allData;
};

const UNINITIALIZED_LAST_PAGE = -1;

export const fetchAllDataByAxios = async (reqOptions: AxiosRequestConfig) => {
  let allData: any[] = [];
  let page: number = 1;
  let lastPage: number = UNINITIALIZED_LAST_PAGE;
  const baseUrl: string = reqOptions?.url ?? "";

  while (true) {
    reqOptions.url = baseUrl + `&page[number]=${page}&page[size]=100`;
    const res: AxiosResponse = await axios.request(reqOptions);
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

  // TODO: 要確認、ここでエラーハンドリングするとでブロイでバグる
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
