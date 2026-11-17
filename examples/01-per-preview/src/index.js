import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
	async increment() {
		const n = ((await this.ctx.storage.get("n")) ?? 0) + 1;
		await this.ctx.storage.put("n", n);
		return n;
	}
}

// Never called by this Worker. It still gets its own namespace in production
// and in every Preview, because namespaces are created at deploy time.
export class Chat extends DurableObject {
	async hello() {
		return "hello";
	}
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname === "/count") {
			const n = await ctx.exports.Counter.getByName("global").increment();
			return Response.json({ count: n });
		}
		return new Response("01-per-preview: try /count\n");
	},
};
