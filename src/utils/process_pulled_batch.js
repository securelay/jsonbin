import fs from 'node:fs';

export function processBatch(pulledQueue){
  const timeNow = Math.round(Date.now()/1000); // Unix-time in seconds
  for (const { uuid, action, json, ttl } of pulledQueue) {
    try {
      switch (action) {
        case 'add':
          fs.writeFileSync(`silo/${uuid}.json`, JSON.stringify(json));
        case 'renew':
          fs.writeFileSync(`.expiry/${uuid}.expiry`, (timeNow + ttl).toString());
          break;
        case 'delete':
          fs.rmSync(`silo/${uuid}.json`);
          fs.rmSync(`.expiry/${uuid}.expiry`);
          break;
        default:
          throw new ERROR(`Unexpected action - '${action}'`);
      }
    } catch (err) {
      console.log(`ERROR while processing batch for ${ JSON.stringify({ uuid, action, json, ttl }) }:`,
        err.message);
      continue;
    }
  }
}
