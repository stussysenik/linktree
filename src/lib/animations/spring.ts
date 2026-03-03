/**
 * Critically-damped spring solver
 * Ported from shopify-gallery/crates/sg-anim/src/lib.rs
 */

export interface SpringParams {
	stiffness: number;
	damping: number;
}

export const DEFAULT_SPRING: SpringParams = {
	stiffness: 180,
	damping: 24
};

export class Spring {
	current: number;
	target: number;
	velocity: number;
	params: SpringParams;

	constructor(value: number, params: SpringParams = DEFAULT_SPRING) {
		this.current = value;
		this.target = value;
		this.velocity = 0;
		this.params = params;
	}

	step(dt: number): void {
		const displacement = this.current - this.target;
		const springForce = -this.params.stiffness * displacement;
		const dampingForce = -this.params.damping * this.velocity;
		const acceleration = springForce + dampingForce;
		this.velocity += acceleration * dt;
		this.current += this.velocity * dt;
	}

	isSettled(threshold = 0.01): boolean {
		return (
			Math.abs(this.current - this.target) < threshold &&
			Math.abs(this.velocity) < threshold
		);
	}

	snap(): void {
		this.current = this.target;
		this.velocity = 0;
	}
}

export class Spring2D {
	x: Spring;
	y: Spring;

	constructor(x: number, y: number, params: SpringParams = DEFAULT_SPRING) {
		this.x = new Spring(x, params);
		this.y = new Spring(y, params);
	}

	setTarget(x: number, y: number): void {
		this.x.target = x;
		this.y.target = y;
	}

	step(dt: number): void {
		this.x.step(dt);
		this.y.step(dt);
	}

	isSettled(threshold = 0.01): boolean {
		return this.x.isSettled(threshold) && this.y.isSettled(threshold);
	}

	snap(): void {
		this.x.snap();
		this.y.snap();
	}
}
