import axios from "axios";

// TODO: how to use import rather than require ?
// import * as program from "commander";
const program = require("commander");

program
  .option("-t, --token <token>", "GitHub API token")
  .option("-u, --username <username>", "User whose repos should be displayed", "taylorjg")
  .option("-p, --page-size <n>", "Page size", parseInt, 10)
  .parse(process.argv);

const myaxios = axios.create({
  baseURL: "https://api.github.com",
  headers: program.token
    ? {
      "Authorization": `token ${program.token}`
    }
    : {}
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

// TODO: create a generic mechanism to fetch all pages of information
// e.g. fetch all repos
// - but not specific to any particular operation

const wrapper = async () => {
  const url = `/users/${program.username}/repos`;
  const config = {
    params: {
      "per_page": program.pageSize
    }
  };
  const response = await myaxios.get(url, config);
  console.log(response.data.map(x => x.html_url));
  const rels = parseLinkHeader(response);
  console.log(`rels:\n${JSON.stringify(rels, null, 2)}`);
  console.log(`x-ratelimit-remaining: ${response.headers['x-ratelimit-remaining']}`);

  // TODO: add error handling - try/catch
};

wrapper();
