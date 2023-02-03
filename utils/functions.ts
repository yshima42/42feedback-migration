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
