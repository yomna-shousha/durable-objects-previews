# Examples

Each example deploys real Workers to your account. Run
`./scripts/count-namespaces.sh my-app` before and after each step to watch the
namespace count change.

```sh
npm install
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
```

The examples use the Worker names `my-app`, `my-app-do`, `my-app-do-staging`
and `my-app-isolated`. **Rename them in the `wrangler.jsonc` files first if any
of those names already exist on your account**, because `wrangler deploy`
overwrites a Worker with the same name.

## 01-per-preview: isolated Previews (option A)

One Worker with two classes, `Counter` and `Chat`. Nothing calls `Chat`.

```sh
cd 01-per-preview
npx wrangler deploy                 # +2: my-app_Counter, my-app_Chat
npx wrangler preview --name pr-1    # +2: my-app_pr-1_Counter, my-app_pr-1_Chat
npx wrangler preview --name pr-2    # +2
npx wrangler preview delete --name pr-1 --skip-confirmation   # -2
```

## 02-shared-host: shared Durable Object host (options B and C)

`host/` owns the classes. `app/` has no classes and binds to the host with
`script_name`: production binds to `my-app-do` and Previews bind to
`my-app-do-staging`.

```sh
cd 02-shared-host/host
npx wrangler deploy                 # +2: my-app-do_*
npx wrangler deploy --env staging   # +2: my-app-do-staging_*

cd ../app
npx wrangler deploy                 # +0
npx wrangler preview --name pr-3 --var PREVIEW_SCOPE:pr-3   # +0
npx wrangler preview --name pr-4 --var PREVIEW_SCOPE:pr-4   # +0
```

`GET /count` returns a counter for the current scope. Production, `pr-3` and
`pr-4` each count independently, even though both Previews share one staging
namespace.

For a pull request that changes Durable Object code, use the isolated config.
It creates the `my-app-isolated` Worker on first use:

```sh
npx wrangler preview --config wrangler.isolated.jsonc --name pr-5 --var PREVIEW_SCOPE:pr-5
# +2: my-app-isolated_pr-5_*
```

## ci

- [`preview.yml`](ci/preview.yml): shared Preview by default, isolated Preview
  when `host/src` changed, and cleanup of both when the PR closes.
- [`deploy.yml`](ci/deploy.yml): deploys the production host, the staging host
  and the app from `main`.

These files aren't active in this repository. Copy them into
`.github/workflows/` in your own repository.

## Clean up

```sh
npx wrangler delete --name my-app
npx wrangler delete --name my-app-isolated
npx wrangler delete --name my-app-do
npx wrangler delete --name my-app-do-staging
```

Deleting a Worker deletes its Durable Object namespaces and their data.
