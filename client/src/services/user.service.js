import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/";

class UserService {
  // Return a GET request on `/api/test/all`:
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  // Return an authorized GET request on `/api/test/user`:
  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  // Return an auhtorized GET request on `/api/test/admin`:
  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

// Export class `UserService`:
export default new UserService();
