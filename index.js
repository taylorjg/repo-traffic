const axios = require("axios");
const program = require("commander");

program
  .option("-t, --token <token>", "GitHub personal access token")
  .option("-u, --username <username>", "User whose repos should be displayed")
  .option("-p, --page-size <n>", "Page size", Number, 100)
  .option("-r, --show-rate-limit", "Show remaining rate limit")
  .parse(process.argv);

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Accept"] = "application/vnd.github.v3+json";

if (program.token) {
  axios.defaults.headers.common["Authorization"] = `token ${program.token}`;
}

const parseLinkHeader = response => {
  const linkHeader = response.headers["link"];
  if (!linkHeader) {
    return [];
  }
  return linkHeader
    .split(",")
    .map(link => link.split(";").map(s => s.trim()))
    .map(([hrefPart, relPart]) => {
      const href = /^<([^>]+)>$/.exec(hrefPart)[1];
      const rel = /^rel="([^"]+)"$/.exec(relPart)[1];
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

const displayRateLimitData = async () => {
  const rateLimitResponse = await axios.get("/rate_limit");
  const rateLimitData = rateLimitResponse.data;
  console.log(`rate limit: ${rateLimitData.resources.core.limit}`);
  console.log(`rate remaining: ${rateLimitData.resources.core.remaining}`);
  console.log(`rate reset: ${new Date(rateLimitData.resources.core.reset * 1000)}`);
};

const handleError = err => {
  if (err.response) {
    const response = err.response;
    const request = response.request;
    const status = response.status;
    const statusText = response.statusText;
    if (response.data && response.data.message) {
      console.log(`[${request.method} ${request.path}] status: ${status}; statusText: ${statusText}; message: ${response.data.message}`);
    }
    else {
      console.log(`[${request.method} ${request.path}] status: ${status}; statusText: ${statusText}; err: ${err}`);
    }
  }
  else {
    if (err.config) {
      console.log(`[${err.config.method} ${err.config.url}] err: ${err}`);
    }
    else {
      console.log(`err: ${err}`);
    }
  }
};

const flatten = arrs =>
  [].concat(...arrs);

const sumBy = (xs, f) =>
  xs.reduce((acc, x) => acc + f(x), 0);

const asyncWrapper = async () => {
  try {
    if (program.showRateLimit) {
      await displayRateLimitData();
    }

    const url = `/users/${program.username}/repos`;
    const config = {
      params: {
        "per_page": program.pageSize
      }
    };
    const repos = flatten(await getPages(url, config));

    process.stdout.write(`${"-".repeat(repos.length)}\n`);

    const results = [];
    let indent = 0;
    for (let index = 0; index < repos.length; index++) {
      try {
        const repo = repos[index];
        const viewsPromise = axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/views`);
        const clonesPromise = axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/clones`);
        const [{ data: views }, { data: clones }] = await Promise.all([viewsPromise, clonesPromise]);

        const result = {
          repo,
          views,
          clones
        };

        results.push(result);

        process.stdout.write(".");
        indent++;
      }
      catch (err) {
        indent && process.stdout.write("\n");
        indent = 0;
        handleError(err);
      }
    }

    process.stdout.write("\n");

    const compareResults = (a, b) => {
      const compareViewsUniques = b.views.uniques - a.views.uniques;
      const compareViewsCount = b.views.count - a.views.count;
      const compareClonesUniques = b.clones.uniques - a.clones.uniques;
      const compareClonesCount = b.clones.count - a.clones.count;
      const compareStarsCount = b.repo.stargazers_count - a.repo.stargazers_count
      return compareViewsUniques ? compareViewsUniques : compareViewsCount;
    };

    const filteredSortedResults = results
      .filter(result => result.views.count || result.clones.count)
      .sort(compareResults);

    const REPO_NAME_COL_WIDTH = 40;
    const COUNT_COL_WIDTH = 5;

    filteredSortedResults.forEach(result => {
      const repoName = result.repo.name.padEnd(REPO_NAME_COL_WIDTH);
      const viewsCount = String(result.views.count).padStart(COUNT_COL_WIDTH);
      const viewsUniques = String(result.views.uniques).padStart(COUNT_COL_WIDTH);
      const clonesCount = String(result.clones.count).padStart(COUNT_COL_WIDTH);
      const clonesUniques = String(result.clones.uniques).padStart(COUNT_COL_WIDTH);
      const viewsNumbers = `views: ${viewsCount} / ${viewsUniques}`;
      const clonesNumbers = `clones: ${clonesCount} / ${clonesUniques}`;
      const stars = `stars: ${result.repo.stargazers_count}`;
      console.log(`${repoName}     ${viewsNumbers}     ${clonesNumbers}     ${stars}`);
    });

    console.log();
    console.log(`Total views: ${sumBy(filteredSortedResults, r => r.views.count)}`);
    console.log(`Total unique views: ${sumBy(filteredSortedResults, r => r.views.uniques)}`);
    console.log(`Total clones: ${sumBy(filteredSortedResults, r => r.clones.count)}`);
    console.log(`Total unique clones: ${sumBy(filteredSortedResults, r => r.clones.uniques)}`);
    console.log(`Total stars: ${sumBy(results, r => r.repo.stargazers_count)}`);
    console.log();

    if (program.showRateLimit) {
      await displayRateLimitData();
    }
  }
  catch (err) {
    handleError(err);
  }
};

asyncWrapper();
