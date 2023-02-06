import axios from "axios";
import preval from "next-plugin-preval";
import { fetchAccessToken } from "./functions";

export default preval(fetchAccessToken());
