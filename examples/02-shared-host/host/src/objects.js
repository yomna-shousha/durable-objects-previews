import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
	async increment() {
		const n = ((await this.ctx.storage.get("n")) ?? 0) + 1;
		await this.ctx.storage.put("n", n);
		return n;
	}
}

export class Chat extends DurableObject {
	async hello() {
		return "hello";
	}
}
