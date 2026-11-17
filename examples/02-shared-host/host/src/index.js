export { Counter, Chat } from "./objects.js";

export default {
	async fetch() {
		return new Response("Durable Object host. Call it through a binding.\n", { status: 404 });
	},
};
