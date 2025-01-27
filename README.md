# jsonbin
Persistent JSON store for [Securelay](https://github.com/securelay/specs).

JSON files are found at path `{endpointID}/{publicKey}.json`.

The JSONs may be served in two ways:

1. By using a CDN like [JSDelivr](https://www.jsdelivr.com/?docs=gh) or https://raw.githubusercontent.com/securelay/jsonbin/{branch}/{filepath}.
2. Through a GitHub Pages static site deployment.

Both JSDelivr and GitHub Pages provide the file with `Content-Type: application/json` header, whereas raw.githubusercontent.com provides it as `content-type: text/plain; charset=utf-8`. For all of these options however, any changes brought about by a commit (such as updating/deleting a JSON) may take some time to take effect. This is due to the cache-refresh time for CDN and deployment time needed for GitHub pages.

In view of the [limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limits-on-use-of-github-pages) on use of GitHub Pages, we currently use the CDN route (JSDelivr) only.

However, if in future GitHub Pages is used, in order not to abuse GitHub's servers, deployment should be triggered n-times a day and not for every push. This may be achieved by setting deployment via actions and not from any branch. In the actions, we can then use cron-like schedule triggers.

The default branch, i.e. where the JSONs are stored, is protected, requiring linear commit history, no force push etc. Pushing to this repo also requires a fine-grained access token.
