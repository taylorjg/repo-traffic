import axios from "axios";

const GITHUBAPI_BASE_URL = "https://api.github.com";
const GITHUB_API_TOKEN = process.argv[2];
const USERNAME = "taylorjg";

const reposUrl = `${GITHUBAPI_BASE_URL}/users/${USERNAME}/repos`;
const config = GITHUB_API_TOKEN ? {
  headers: {
    "Authorization": `token ${GITHUB_API_TOKEN}`
  }
} : undefined;

const wrapper = async () => {
  const response = await axios.get(reposUrl, config);
  // console.log(response);
  console.log(`x-ratelimit-remaining: ${response.headers['x-ratelimit-remaining']}`);
};

wrapper();
