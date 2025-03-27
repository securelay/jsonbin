// Brief: Expire JSON files from /silo based on their expiry in /.expiry
// Runtime: Node in a GitHub workflow

import fs from 'node:fs';

const timeNow = Math.round(Date.now()/1000); // Unix-time in seconds

function expireBasedOn(expiryFile){
  if (!expiryFile.endsWith('.expiry')) return;
  fs.readFile(`.expiry/${expiryFile}`, 'utf8', (_, expireAt) => {
    if (timeNow < Number(expireAt)) return;
    const uuid = expiryFile.split('.')[0];
    fs.rmSync(`silo/${uuid}.json`);
    fs.rmSync(`.expiry/${uuid}.expiry`);
    console.log(`Expired ${ JSON.stringify({ uuid }) }`);
  })
}

fs.readdir('.expiry', (_, expiryFiles) => {
  expiryFiles.forEach((expiryFile) => {
    expireBasedOn(expiryFile);
  });
})
