import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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

export const fetchAllDataByAxios = async (reqOptions: AxiosRequestConfig) => {
  let allData: any[] = [];
  let nextPageUrl: string = reqOptions?.url ?? "";

  while (nextPageUrl) {
    const res: AxiosResponse = await axios.request(reqOptions);
    allData = allData.concat(res.data);
    nextPageUrl = res.headers["link"]?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    reqOptions.url = nextPageUrl;
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
