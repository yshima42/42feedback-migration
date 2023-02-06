import preval from "next-plugin-preval";
import { CursusUser } from "types/cursusUsers";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "./constants";
import { fetchAccessToken, fetchAllDataByAxios } from "./functions";

const fetchCursusUsers = async () => {
  const token = await fetchAccessToken();
  const url = `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${CAMPUS_ID}`;
  const cursusUsers: CursusUser[] = await fetchAllDataByAxios(
    url,
    token.access_token
  );
  return cursusUsers;
};

export default preval(fetchCursusUsers());
