import axios from "axios";

const GITHUBAPI_BASE_URL = "https://api.github.com";

// TODO: use something like 'commander' to get this from the command line
const GITHUB_API_TOKEN = process.argv[2];

// TODO: use something like 'commander' to get this from the command line
const USERNAME = "taylorjg";

const reposUrl = `${GITHUBAPI_BASE_URL}/users/${USERNAME}/repos?per_page=100`;
const config = GITHUB_API_TOKEN ? {
  headers: {
    "Authorization": `token ${GITHUB_API_TOKEN}`
  }
} : undefined;

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

// TODO: create a generic mechanism to fetch all pages of information
// e.g. fetch all repos
// - but not specific to any particular operation

const wrapper = async () => {
  const response = await axios.get(reposUrl, config);
  console.log(response.data.map(x => x.html_url));
  const rels = parseLinkHeader(response);
  console.log(`rels:\n${JSON.stringify(rels, null, 2)}`);
  // console.log(`x-ratelimit-remaining: ${response.headers['x-ratelimit-remaining']}`);
};

wrapper();
