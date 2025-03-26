// Brief: Pull from upstream Redis (Upstash) and store in the local filesystem (Git repository)
// Runtime: Node in a GitHub workflow

import { processBatch } from './utils/process_pulled_batch.js';
import { Redis } from '@upstash/redis';
import { Octokit } from '@octokit/core';

// Securelay endpoint sets label 'pull' to a issue #1 of securelay/jsonbin whenever upstream has data
// So, remove that label before pulling from upstream
// Exit with error when label is not found, meaning no data in upstream
// Such an exit would stop the workflow, which is ok, as nothing needs to be done
const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
const [ owner, repo ] = process.env.GITHUB_OWNER_REPO.split('/');
await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
      owner,
      repo,
      issue_number: 1,
      name: 'pull',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).catch((err) => {
      if (err.status == 404) {
        console.log('Up-to-date. No need to pull.');
        process.exit(0);
      } else {
        throw err;
      }
    })

// Pull and store (process) data from upstream
const redis = Redis.fromEnv({
  latencyLogging: false,
  enableAutoPipelining: true,
  automaticDeserialization: true // So that we get object instead of JSON string
});
const batchSize = 100;
let pulledQueue;
do {
  pulledQueue = await redis.lpop('cdn:', batchSize);
  processBatch(pulledQueue);
} while (pulledQueue.length == batchSize);
