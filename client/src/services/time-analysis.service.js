import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/admin/";

class TimeAnalysisService {
  getTimeAnalysis() {
    return axios.get(API_URL + "time-analysis", { headers: authHeader() });
  }
}

export default new TimeAnalysisService();
