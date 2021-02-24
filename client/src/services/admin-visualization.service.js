import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/admin/";

class AdminVisualizationService {
  getAdminVisualizationData() {
    return axios.get(API_URL + "admin-visualization", {
      headers: authHeader(),
    });
  }
}

export default new AdminVisualizationService();
