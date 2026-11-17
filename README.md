# Durable Objects and Worker Previews: keep your namespace count flat

Each Durable Object class uses one namespace in production and another in every
[Worker Preview](https://developers.cloudflare.com/workers/previews/). If every
pull request gets a Preview, the count grows with your open PRs until you hit the
[account limit](https://developers.cloudflare.com/durable-objects/platform/limits/)
and deploys fail.

This repo is a small Astro site that explains why and compares the patterns that
keep the count flat. It also includes runnable examples you can deploy to check
the numbers yourself.

## TL;DR

```
namespaces = classes × (1 production + number of Previews)
```

| Pattern | New namespaces per Preview | Runs the branch's DO code |
| --- | --- | --- |
| **A.** Isolated Previews (default) | one per class | Yes |
| **B.** Shared Durable Object host | **0** | No (runs `main`) |
| **C.** Shared host, isolated when DO code changes | **0**, or one per class for those PRs | When it changed |

- Namespaces are created at deploy time, including for classes nothing calls.
- To stop Previews from adding namespaces, move the classes into a separate
  Worker that you never preview, and bind to it with `script_name`.
- Pointing a Preview's bindings at production with `script_name` doesn't help
  while the same Worker still exports the classes.
- Version URLs aren't generated for Workers that implement a Durable Object.
  Once you move the classes out, they work on the app Worker.
- `wrangler preview delete` frees a Preview's namespaces right away.

## Run the site

```sh
npm install
npm run dev
```

## Run the examples

```sh
cd examples
npm install

export CLOUDFLARE_API_TOKEN=...   # needs Workers Scripts edit access
export CLOUDFLARE_ACCOUNT_ID=...
./scripts/count-namespaces.sh my-app
```

See [`examples/README.md`](examples/README.md) for step-by-step commands. The
examples deploy Workers named `my-app`, `my-app-do`, `my-app-do-staging` and
`my-app-isolated`. Rename them first if those names are already taken on your
account.

| Path | What it shows |
| --- | --- |
| [`examples/01-per-preview`](examples/01-per-preview) | Option A. Every Preview gets one namespace per class. |
| [`examples/02-shared-host`](examples/02-shared-host) | Options B and C. A host Worker owns the classes; the app binds to it. |
| [`examples/ci`](examples/ci) | GitHub Actions workflows for Previews, cleanup and deploys. |
| [`examples/scripts/count-namespaces.sh`](examples/scripts/count-namespaces.sh) | Counts namespaces on your account. |

## Notes

Tested with Wrangler 4.164.0 on November 17, 2026. `wrangler preview` is in open
beta, so behavior may change.

Community example, not official Cloudflare documentation.

## License

[MIT](LICENSE)
