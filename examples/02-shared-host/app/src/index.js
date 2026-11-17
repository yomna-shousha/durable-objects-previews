export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Previews share the staging host's namespaces, so prefix every object
		// name with a scope to keep each Preview's state separate.
		const scope = env.PREVIEW_SCOPE ?? "production";

		if (url.pathname === "/count") {
			const n = await env.COUNTER.getByName(`${scope}:global`).increment();
			return Response.json({ scope, count: n });
		}
		return new Response("02-shared-host: try /count\n");
	},
};
