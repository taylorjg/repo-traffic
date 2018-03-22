import axios from "axios";

// TODO: how to use import rather than require ?
// import * as program from "commander";
const program = require("commander");

program
  .option("-t, --token <token>", "GitHub API token")
  .option("-u, --username <username>", "User whose repos should be displayed", "taylorjg")
  .parse(process.argv);

const GITHUBAPI_BASE_URL = "https://api.github.com";
const USERNAME = program.username;

const reposUrl = `${GITHUBAPI_BASE_URL}/users/${USERNAME}/repos`;

// TODO: make this the default config for axios so we don't
//       have to specify it explicitly with each call ?
const DEFAULT_CONFIG = program.token
  ? {
    headers: {
      "Authorization": `token ${program.token}`
    }
  }
  : {};

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
  const config = Object.assign({ params: { "per_page": 5 } }, DEFAULT_CONFIG);
  const response = await axios.get(reposUrl, config);
  console.log(response.data.map(x => x.html_url));
  const rels = parseLinkHeader(response);
  console.log(`rels:\n${JSON.stringify(rels, null, 2)}`);
  console.log(`x-ratelimit-remaining: ${response.headers['x-ratelimit-remaining']}`);

  // TODO: add error handling - try/catch
};

wrapper();
