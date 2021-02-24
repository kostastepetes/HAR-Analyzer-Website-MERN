export default function cleanFileData(fileData) {
  // Store the `entries` array on local constant `entries`:
  const entries = fileData.log.entries;

  return entries.map((entry) => {
    const container = {};

    const reqHeaders = [];

    const url = new URL(entry.request.url);

    entry.request.headers.forEach((header) => {
      if (
        header.name.toLowerCase() === "content-type" ||
        header.name.toLowerCase() === "cache-control" ||
        header.name.toLowerCase() === "pragma" ||
        header.name.toLowerCase() === "expires" ||
        header.name.toLowerCase() === "age" ||
        header.name.toLowerCase() === "last-modified" ||
        header.name.toLowerCase() === "host"
      ) {
        reqHeaders.push({
          name: header.name.toLowerCase(),
          value: header.value,
        });
      }
    });

    const resHeaders = [];

    entry.response.headers.forEach((header) => {
      if (
        header.name.toLowerCase() === "content-type" ||
        header.name.toLowerCase() === "cache-control" ||
        header.name.toLowerCase() === "pragma" ||
        header.name.toLowerCase() === "expires" ||
        header.name.toLowerCase() === "age" ||
        header.name.toLowerCase() === "last-modified" ||
        header.name.toLowerCase() === "host"
      ) {
        resHeaders.push({
          name: header.name.toLowerCase(),
          value: header.value,
        });
      }
    });

    let fileExtension = entry.request.url.split(".").pop();
    if (!resHeaders.some((header) => header.name === "content-type")) {
      if (
        fileExtension === "html" ||
        fileExtension === "htm" ||
        fileExtension === "php" ||
        fileExtension === "asp" ||
        fileExtension === "jsp" ||
        url.pathname === "/"
      ) {
        resHeaders.push({ name: "content-type", value: "text/html" });
      }
    }

    container.startedDateTime = entry.startedDateTime;
    container.timings = { wait: entry.timings.wait };
    container.serverIPAddress = entry.serverIPAddress;
    container.request = {
      method: entry.request.method,
      url: url.hostname,
      headers: reqHeaders,
    };
    container.response = {
      status: entry.response.status,
      statusText: entry.response.statusText,
      headers: resHeaders,
    };

    return container;
  });
}
