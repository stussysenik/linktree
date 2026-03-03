/**
 * Matrix rain Canvas 2D renderer.
 * Katakana + ASCII charset, column-based drop model.
 * FPS-limited to ~25 for retro feel.
 */

// Katakana Unicode range + ASCII digits/symbols
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const ASCII = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';
const CHARSET = KATAKANA + ASCII;

function randomChar(): string {
	return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

export interface MatrixConfig {
	fontSize?: number;
	color?: string;
	fadeAlpha?: number;
	targetFPS?: number;
}

const DEFAULTS: Required<MatrixConfig> = {
	fontSize: 14,
	color: '#3de84a',
	fadeAlpha: 0.05,
	targetFPS: 25
};

export class MatrixRenderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private columns: number = 0;
	private drops: number[] = [];
	private config: Required<MatrixConfig>;
	private frame: number = 0;
	private lastFrameTime = 0;
	private frameInterval: number;
	private running = false;

	constructor(canvas: HTMLCanvasElement, config: MatrixConfig = {}) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
		this.config = { ...DEFAULTS, ...config };
		this.frameInterval = 1000 / this.config.targetFPS;
		this.resize();
	}

	resize(): void {
		const dpr = window.devicePixelRatio || 1;
		const rect = this.canvas.getBoundingClientRect();
		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;
		this.ctx.scale(dpr, dpr);

		this.columns = Math.floor(rect.width / this.config.fontSize);
		this.drops = new Array(this.columns).fill(0).map(() => Math.random() * -100);
	}

	private renderFrame = (timestamp: number): void => {
		if (!this.running) return;

		const elapsed = timestamp - this.lastFrameTime;
		if (elapsed < this.frameInterval) {
			this.frame = requestAnimationFrame(this.renderFrame);
			return;
		}
		this.lastFrameTime = timestamp;

		const { ctx, canvas, config } = this;
		const rect = canvas.getBoundingClientRect();

		// Fade trail
		ctx.fillStyle = `rgba(10, 10, 15, ${config.fadeAlpha})`;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Draw characters
		ctx.fillStyle = config.color;
		ctx.font = `${config.fontSize}px "JetBrains Mono", monospace`;

		for (let i = 0; i < this.drops.length; i++) {
			const char = randomChar();
			const x = i * config.fontSize;
			const y = this.drops[i] * config.fontSize;

			// Bright head character
			ctx.fillStyle = '#ffffff';
			ctx.fillText(char, x, y);

			// Regular trail color for subsequent chars
			ctx.fillStyle = config.color;

			if (y > rect.height && Math.random() > 0.975) {
				this.drops[i] = 0;
			}

			this.drops[i]++;
		}

		this.frame = requestAnimationFrame(this.renderFrame);
	};

	start(): void {
		if (this.running) return;
		this.running = true;
		this.lastFrameTime = performance.now();
		this.frame = requestAnimationFrame(this.renderFrame);
	}

	stop(): void {
		this.running = false;
		cancelAnimationFrame(this.frame);
	}

	destroy(): void {
		this.stop();
	}
}
