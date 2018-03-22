import axios from "axios";
import program from "commander";

program
  .option("-t, --token <token>", "GitHub API token")
  .option("-u, --username <username>", "User whose repos should be displayed", "taylorjg")
  .option("-p, --page-size <n>", "Page size", Number, 100)
  .parse(process.argv);

axios.defaults.baseURL = "https://api.github.com";

if (program.token) {
  axios.defaults.headers.common["Authorization"] = `token ${program.token}`;
}

axios.interceptors.response.use(response => {
  const request = response.request;
  const message = `x-ratelimit-remaining: ${response.headers['x-ratelimit-remaining']}`;
  console.log(`[${request.method} ${request.path}] ${message}`);
  return response;
});

const parseLinkHeader = response => {
  const linkHeader = response.headers["link"];
  if (!linkHeader) {
    return [];
  }
  return linkHeader
    .split(",")
    .map(link => link.split(";").map(bit => bit.trim()))
    .map(bits => {
      const bit0 = bits[0];
      const bit1 = bits[1];
      const href = /^<(.*)>$/.exec(bit0)[1];
      const rel = /^rel="(.*)"$/.exec(bit1)[1];
      return { href, rel };
    });
};

const getPages = async (url, config) => {
  const response = await axios.get(url, config);
  const rels = parseLinkHeader(response);
  const next = rels.find(rel => rel.rel === "next");
  if (next) {
    return [response.data, ...await getPages(next.href, config)];
  }
  else {
    return [response.data];
  }
};

const handleError = err => {
  const SEPARATOR_LINE = "-".repeat(30);
  console.log(`${SEPARATOR_LINE} START ERROR ${SEPARATOR_LINE}`);
  if (err.response) {
    const response = err.response;
    const request = response.request;
    const status = response.status;
    const statusText = response.statusText;
    const message = `status: ${status}; statusText: ${statusText}`;
    console.log(`[${request.method} ${request.path}] ${message}`);
  }
  else {
    if (err.config) {
      console.log(`method: ${err.config.method}; path: ${err.config.url}`);
    }
    console.log(`${err}`);
  }
  console.log(`${SEPARATOR_LINE}  END ERROR  ${SEPARATOR_LINE}`);
};

const flatten = xs => [].concat(...xs);

const wrapper = async () => {
  try {
    const url = `/users/${program.username}/repos`;
    const config = {
      params: {
        "per_page": program.pageSize
      }
    };
    const data = flatten(await getPages(url, config));
    data.forEach((repo, index) => console.log(`[${index}] html_url: ${repo.html_url}`));
  }
  catch (err) {
    handleError(err);
  }
};

wrapper();
