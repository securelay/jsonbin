[![Pull](https://github.com/securelay/jsonbin/actions/workflows/pull.yml/badge.svg)](https://github.com/securelay/jsonbin/actions/workflows/pull.yml) [![Expire](https://github.com/securelay/jsonbin/actions/workflows/expire.yml/badge.svg)](https://github.com/securelay/jsonbin/actions/workflows/expire.yml)

# jsonbin
Persistent JSON store for [Securelay](https://github.com/securelay/specs).

## Directory structure
- JSON files are found in [silo](./silo/).

- The unix-time, in seconds, that `silo/{UUID}.json` expires at, is stored in [.expiry](./.expiry) as `.expiry/{UUID}.expiry`.


## Public access, CDN
The stored JSONs may be accessed publicly:
- by using a CDN, e.g. [JSDelivr](https://www.jsdelivr.com/?docs=gh) or [Statically](https://statically.io/). These respond with `Content-Type: application/json` header, as desired.

- by using *raw.githubusercontent.com* with the schema: `https://raw.githubusercontent.com/securelay/jsonbin/main/silo/{UUID}.json`. This responds with `content-type: text/plain; charset=utf-8`.

Both these options however, may cache the JSON for a while, because of which, any changes brought about by a commit (such as creating/updating/deleting a JSON) may not be reflected immediately.

## Workflows
The following workflows keep this repo up-to-date. All workflows share the same concurrency key, so that only one workflow runs at any given time.

### Pull
New JSONs are pulled from upstream by the workflow, [pull.yml](./.github/workflows/pull.yml). This workflow is triggered on demand by the `workflow_dispatch` event. It also runs regularly as a scheduled cronjob.

Integration with Securelay is as follows.
- As new JSONs are created, Securelay enqueues them in an upstream database.
- After the first enqueue event every cycle, i.e. after pushing the first JSON in an otherwise empty queue, Securelay adds the label `pull` to issue [#1](https://github.com/securelay/jsonbin/issues/1). Along with this, it also triggers a `workflow_dispatch` event in this repository to run the workflow on-demand.
- The workflow first tries to remove the said issue-label. If the label didn't exist, it is inferred that the upstream is empty and the workflow then exits gracefully.
- If issue-label is removed successfully, the workflow pulls JSONs from upstream in batches until empty. 

### Expire
Expired JSONs are removed by the workflow, [expiry.yml](./.github/workflows/expiry.yml). This workflow is triggerred regularly as a cronjob.

## Fair use policy
Not to abuse GitHub,
- activities (such as pushes and workflow runs) on this repository are kept sparse. 
- only very small JSONs (<=10 KB each) are allowed to be pushed. Repository size is kept within a few GBs by regularly pruning the expired JSONs.

If you use this repository directly or indirectly, you are bound by and agree to
- [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
- [Securelay Terms of Service](https://securelay.github.io/ToS.txt)
- [License](./LICENSE) and the following [Data policy](#data-policy)

## Data policy
Any given JSON file within [silo/](./silo/), is created by a [Securelay](https://securelay.github.io) user with a private key, in order to be disseminated publicly. If you are such a user, you understand that data in your JSON file is/will be in the public domain once it appears in this repository. Although JSONs can be deleted from this repository by the creator through Securelay, the data may persist on GitHub and different CDN servers that may have cached the data.
