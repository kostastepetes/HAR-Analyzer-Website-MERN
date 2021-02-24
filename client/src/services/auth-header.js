// Export function `authHeader()` that returns an authentication header containing current user's token:
export default function authHeader() {
  // Retrieve `user` from the browser's `localStorage` and store in `user` constant:
  const user = JSON.parse(localStorage.getItem("user"));

  // If `user` in not empty and `accessToken` is also not empty:
  if (user && user.accessToken) {
    // Return JSON object with the header and token:
    return { "x-access-token": user.accessToken };
  } else {
    // Return empty JSON object;
    return {};
  }
}
