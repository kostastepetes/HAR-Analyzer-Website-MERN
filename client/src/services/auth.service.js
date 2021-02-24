import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
  // `login` function that sends login data to the server:
  login(username, password) {
    return axios
      .post(API_URL + "login", {
        username,
        password,
      })
      .then((response) => {
        // If `accessToken` is not empty:
        if (response.data.accessToken) {
          // Store `user` data in  the browser's localStorage:
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  // `logout` function that deletes `user` from localStorage:
  logout() {
    localStorage.removeItem("user");
  }

  // `register` function that sends register data to the server:
  register(username, email, password) {
    return axios.post(API_URL + "register", {
      username,
      email,
      password,
    });
  }

  // `getCurrentUser` function that retrieves the `user` from the browser's localStorage:
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

// Export class `AuthService`:
export default new AuthService();
