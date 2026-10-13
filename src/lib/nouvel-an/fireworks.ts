import type { TitlePoint } from "./titlePoints";

export type FireworkPattern = "pivoine" | "anneau" | "saule";

export type FireworkEvent = {
  at: number;
  x: number;
  targetY: number;
  pattern: FireworkPattern;
  finale?: boolean;
};

export type FireworksOptions = {
  lite?: boolean;
  reducedMotion?: boolean;
  onBurst?: (intensity: number) => void;
  onFinaleBurst?: (engine: FireworksEngine, reducedMotion: boolean) => void;
};

type Rocket = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  velocityY: number;
  targetY: number;
  pattern: FireworkPattern;
  finale: boolean;
  trailX: Float32Array;
  trailY: Float32Array;
  trailLength: number;
};

type Spark = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  velocityX: number;
  velocityY: number;
  life: number;
  lifetime: number;
  size: number;
  colorStep: number;
  pattern: FireworkPattern;
  finale: boolean;
  forming: boolean;
  targetX: number;
  targetY: number;
  targetColor: string;
  formationTime: number;
};

const SHOW_EVENTS: FireworkEvent[] = [
  { at: 0, x: 0.18, targetY: 0.28, pattern: "pivoine" },
  { at: 0.82, x: 0.51, targetY: 0.2, pattern: "anneau" },
  { at: 1.66, x: 0.82, targetY: 0.31, pattern: "saule" },
  { at: 2.3, x: 0.35, targetY: 0.36, pattern: "anneau" },
  { at: 2.65, x: 0.68, targetY: 0.26, pattern: "pivoine" },
  { at: 3, x: 0.5, targetY: 0.4, pattern: "saule" },
  { at: 3.35, x: 0.22, targetY: 0.22, pattern: "pivoine" },
  { at: 3.7, x: 0.78, targetY: 0.35, pattern: "anneau" },
  { at: 4.05, x: 0.43, targetY: 0.18, pattern: "saule" },
  { at: 4.4, x: 0.61, targetY: 0.3, pattern: "pivoine" },
  { at: 4.75, x: 0.3, targetY: 0.4, pattern: "anneau" },
  { at: 5.1, x: 0.72, targetY: 0.2, pattern: "saule" },
  { at: 5.45, x: 0.48, targetY: 0.34, pattern: "pivoine" },
  { at: 6.1, x: 0.5, targetY: 0.19, pattern: "saule", finale: true },
];

const COLORS = [
  "#fff8e8",
  "#fff1ce",
  "#f5d98f",
  "#e9bd62",
  "#c9974f",
  "#bd704d",
];
const FORMATION_COLORS = Array.from({ length: 17 }, (_, index) => {
  const amount = index / 16;
  const start = [255, 249, 232];
  const end = [218, 171, 83];
  const channels = start.map((value, channel) =>
    Math.round(value + (end[channel] - value) * amount)
  );
  return `rgb(${channels.join(",")})`;
});
const MAX_PARTICLES = 3300;
const MAX_LITE_PARTICLES = 1900;
const ROCKET_TRAIL_LENGTH = 5;

export class FireworksEngine {
  private readonly context: CanvasRenderingContext2D;
  private readonly options: FireworksOptions;
  private readonly active: Spark[] = [];
  private readonly pool: Spark[] = [];
  private readonly rockets: Rocket[] = [];
  private readonly events: FireworkEvent[];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private elapsed = 0;
  private nextEvent = 0;
  private scheduleEnabled = true;
  private formationStarted = false;
  private ambient = false;
  private ambientElapsed = 0;
  private destroyed = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    options: FireworksOptions = {}
  ) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Impossible de créer le canvas des feux.");
    this.context = context;
    this.options = options;
    this.events = options.lite
      ? SHOW_EVENTS.filter(
          (event) => event.finale || event.at < 1.7 || event.at === 3.7 || event.at === 5.1
        )
      : SHOW_EVENTS;
    this.resize();
  }

  get isForming(): boolean {
    return this.formationStarted;
  }

  resize() {
    const oldWidth = this.width;
    const oldHeight = this.height;
    this.width = Math.max(1, this.canvas.clientWidth);
    this.height = Math.max(1, this.canvas.clientHeight);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (oldWidth && oldHeight) {
      const scaleX = this.width / oldWidth;
      const scaleY = this.height / oldHeight;
      for (const spark of this.active) {
        spark.x *= scaleX;
        spark.previousX *= scaleX;
        spark.y *= scaleY;
        spark.previousY *= scaleY;
        if (spark.forming) {
          spark.targetX *= scaleX;
          spark.targetY *= scaleY;
        }
      }
      for (const rocket of this.rockets) {
        rocket.x *= scaleX;
        rocket.previousX *= scaleX;
        rocket.y *= scaleY;
        rocket.previousY *= scaleY;
        rocket.targetY *= scaleY;
        for (let index = 0; index < rocket.trailLength; index++) {
          rocket.trailX[index] *= scaleX;
          rocket.trailY[index] *= scaleY;
        }
      }
    }
  }

  startShow(skip = false) {
    if (skip || this.options.reducedMotion) {
      this.scheduleEnabled = false;
    }
    if (skip) {
      this.createRestingSparks(12);
      this.ambient = true;
      return;
    }
    if (this.options.reducedMotion) {
      this.createRestingSparks(this.options.lite ? 5 : 10);
      this.options.onFinaleBurst?.(this, true);
    }
  }

  launch(
    x: number,
    targetY: number,
    pattern: FireworkPattern = "pivoine",
    finale = false
  ) {
    if (this.destroyed || this.options.reducedMotion) return;

    const startY = this.height * 0.94;
    const destinationY = Math.max(0, Math.min(1, targetY)) * this.height;
    const gravity = this.height * 0.82;
    this.rockets.push({
      x: Math.max(0, Math.min(1, x)) * this.width,
      y: startY,
      previousX: Math.max(0, Math.min(1, x)) * this.width,
      previousY: startY,
      velocityY: -Math.sqrt(2 * gravity * Math.max(1, startY - destinationY)),
      targetY: destinationY,
      pattern,
      finale,
      trailX: new Float32Array(ROCKET_TRAIL_LENGTH),
      trailY: new Float32Array(ROCKET_TRAIL_LENGTH),
      trailLength: 0,
    });
  }

  update(dt: number) {
    if (this.destroyed) return;
    const delta = Math.max(0, Math.min(dt, 0.05));
    this.elapsed += delta;
    if (this.scheduleEnabled) this.processEvents();

    for (let index = this.rockets.length - 1; index >= 0; index--) {
      const rocket = this.rockets[index];
      rocket.previousX = rocket.x;
      rocket.previousY = rocket.y;
      this.pushRocketTrail(rocket, rocket.x, rocket.y);
      rocket.velocityY += this.height * 0.82 * delta;
      rocket.velocityY *= Math.pow(0.998, delta * 60);
      rocket.y += rocket.velocityY * delta;

      if (rocket.y <= rocket.targetY || rocket.velocityY >= 0) {
        this.explode(rocket);
        this.rockets.splice(index, 1);
      }
    }

    this.updateSparks(delta);
    this.updateAmbient(delta);
  }

  draw() {
    if (this.destroyed) return;
    const context = this.context;
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = `rgba(0,0,0,${this.options.reducedMotion ? 0.08 : 0.18})`;
    context.fillRect(0, 0, this.width, this.height);
    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";

    if (!this.options.reducedMotion) {
      context.lineWidth = 1.4;
      context.strokeStyle = "#fff0c9";
      for (const rocket of this.rockets) {
        context.globalAlpha = 0.72;
        context.beginPath();
        context.moveTo(rocket.previousX, rocket.previousY);
        context.lineTo(rocket.x, rocket.y);
        context.stroke();
        for (let index = 1; index < rocket.trailLength; index++) {
          context.globalAlpha = 0.32 * (1 - index / rocket.trailLength);
          context.beginPath();
          context.moveTo(rocket.trailX[index - 1], rocket.trailY[index - 1]);
          context.lineTo(rocket.trailX[index], rocket.trailY[index]);
          context.stroke();
        }
      }
    }

    for (const spark of this.active) {
      const lifeRatio = Math.min(1, spark.life / spark.lifetime);
      const fade = spark.forming
        ? this.options.lite
          ? 0.46
          : 0.4 + (Math.sin(spark.formationTime * 4 + spark.targetX * 0.04) + 1) * 0.06
        : Math.min(1, lifeRatio * 5, (1 - lifeRatio) * 2.6);
      context.globalAlpha = Math.max(0, fade);
      context.strokeStyle = spark.forming
        ? spark.formationTime >= 2.2
          ? spark.targetColor
          : FORMATION_COLORS[spark.colorStep]
        : COLORS[spark.colorStep % COLORS.length];
      context.lineWidth = spark.size;

      if (this.options.reducedMotion || spark.forming) {
        context.beginPath();
        context.arc(
          spark.x,
          spark.y,
          spark.size * (spark.forming ? 0.78 : 1.4),
          0,
          Math.PI * 2
        );
        context.fillStyle = context.strokeStyle;
        context.fill();
      } else {
        context.beginPath();
        context.moveTo(spark.previousX, spark.previousY);
        context.lineTo(spark.x, spark.y);
        context.stroke();

        if (!this.options.lite && Math.random() < 0.08) {
          context.globalAlpha *= 0.45;
          context.beginPath();
          context.arc(spark.x, spark.y, spark.size * 1.6, 0, Math.PI * 2);
          context.fillStyle = context.strokeStyle;
          context.fill();
        }
      }
    }

    context.restore();
  }

  formShape(points: TitlePoint[]) {
    if (this.destroyed || points.length === 0) return;
    this.formationStarted = true;
    const targets = [...points];
    for (let index = targets.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [targets[index], targets[other]] = [targets[other], targets[index]];
    }

    let targetIndex = 0;
    for (const spark of this.active) {
      if (!spark.finale) continue;
      const point = targets[targetIndex % targets.length];
      targetIndex++;
      spark.forming = true;
      spark.targetX = point.x;
      spark.targetY = point.y;
      spark.targetColor = point.color ?? "#f3dfad";
      spark.lifetime = 30;
      spark.formationTime = 0;
    }
  }

  setAmbient(active: boolean) {
    this.ambient = active;
  }

  destroy() {
    this.destroyed = true;
    this.rockets.length = 0;
    this.active.length = 0;
    this.pool.length = 0;
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private processEvents() {
    while (
      this.nextEvent < this.events.length &&
      this.elapsed >= this.events[this.nextEvent].at
    ) {
      const event = this.events[this.nextEvent++];
      this.launch(event.x, event.targetY, event.pattern, event.finale);
    }
  }

  private pushRocketTrail(rocket: Rocket, x: number, y: number) {
    if (rocket.trailLength < ROCKET_TRAIL_LENGTH) {
      rocket.trailX[rocket.trailLength] = x;
      rocket.trailY[rocket.trailLength] = y;
      rocket.trailLength++;
      return;
    }
    rocket.trailX.copyWithin(0, 1);
    rocket.trailY.copyWithin(0, 1);
    rocket.trailX[ROCKET_TRAIL_LENGTH - 1] = x;
    rocket.trailY[ROCKET_TRAIL_LENGTH - 1] = y;
  }

  private explode(rocket: Rocket) {
    const portraitScale = Math.min(1, (this.width / this.height) * 1.15);
    const liteScale = this.options.lite ? 0.58 : 1;
    const finaleScale = rocket.finale ? 1.55 : 1;
    if (rocket.finale) {
      while (this.active.length > 0) this.recycleSpark(this.active.length - 1);
    }
    const count = rocket.finale
      ? this.options.lite
        ? 1800
        : 3200
      : Math.round(
          (rocket.pattern === "saule" ? 90 : 78) *
            portraitScale *
            liteScale
        );

    for (let index = 0; index < count; index++) {
      const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.12;
      const speed = (0.18 + Math.random() * 0.48) * this.height * finaleScale;
      let velocityX = Math.cos(angle) * speed;
      let velocityY = Math.sin(angle) * speed;

      if (rocket.pattern === "anneau") {
        const ringSpeed = (0.32 + Math.random() * 0.06) * this.height * finaleScale;
        velocityX = Math.cos(angle) * ringSpeed;
        velocityY = Math.sin(angle) * ringSpeed;
      } else if (rocket.pattern === "saule") {
        velocityX *= 0.58;
        velocityY *= 0.7;
      }

      const copper = Math.random() < 0.1;
      this.spawnSpark({
        x: rocket.x,
        y: rocket.y,
        velocityX,
        velocityY,
        lifetime:
          rocket.pattern === "saule"
            ? 3.1 + Math.random() * 1.5
            : 1.6 + Math.random() * 1.2,
        pattern: rocket.pattern,
        finale: rocket.finale,
        colorStep: copper ? 5 : Math.floor(Math.random() * 5),
      });
    }

    this.options.onBurst?.(rocket.finale ? 1 : 0.45);
    if (rocket.finale) this.options.onFinaleBurst?.(this, false);
  }

  private spawnSpark(options: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    lifetime: number;
    pattern: FireworkPattern;
    finale: boolean;
    colorStep: number;
  }) {
    const maximum = this.options.lite ? MAX_LITE_PARTICLES : MAX_PARTICLES;
    if (this.active.length >= maximum) return;

    const spark = this.pool.pop() ?? {
      x: 0,
      y: 0,
      previousX: 0,
      previousY: 0,
      velocityX: 0,
      velocityY: 0,
      life: 0,
      lifetime: 0,
      size: 0,
      colorStep: 0,
      pattern: "pivoine" as FireworkPattern,
      finale: false,
      forming: false,
      targetX: 0,
      targetY: 0,
      targetColor: "#f3dfad",
      formationTime: 0,
    };

    spark.x = options.x;
    spark.y = options.y;
    spark.previousX = options.x;
    spark.previousY = options.y;
    spark.velocityX = options.velocityX;
    spark.velocityY = options.velocityY;
    spark.life = 0;
    spark.lifetime = options.lifetime;
    spark.size = options.finale
      ? 0.65 + Math.random() * (this.options.lite ? 0.45 : 0.7)
      : 0.8 + Math.random() * (this.options.lite ? 0.7 : 1.2);
    spark.colorStep = options.colorStep;
    spark.pattern = options.pattern;
    spark.finale = options.finale;
    spark.forming = false;
    spark.targetX = 0;
    spark.targetY = 0;
    spark.targetColor = "#f3dfad";
    spark.formationTime = 0;
    this.active.push(spark);
  }

  private updateSparks(dt: number) {
    const drag = Math.pow(this.options.lite ? 0.982 : 0.988, dt * 60);
    const gravity = this.height * 0.38;

    for (let index = this.active.length - 1; index >= 0; index--) {
      const spark = this.active[index];
      spark.previousX = spark.x;
      spark.previousY = spark.y;
      spark.life += dt;

      if (spark.forming) {
        const offsetX = (Math.random() - 0.5) * (this.options.lite ? 2 : 7);
        const offsetY = (Math.random() - 0.5) * (this.options.lite ? 2 : 7);
        const targetDx = spark.targetX - spark.x;
        const targetDy = spark.targetY - spark.y;
        const dx = targetDx + offsetX;
        const dy = targetDy + offsetY;
        spark.velocityX = (spark.velocityX + dx * 8 * dt) * Math.pow(0.72, dt * 60);
        spark.velocityY = (spark.velocityY + dy * 8 * dt) * Math.pow(0.72, dt * 60);
        spark.x += spark.velocityX * dt;
        spark.y += spark.velocityY * dt;

        spark.formationTime += dt;
        const progress = Math.min(1, spark.formationTime / 2.2);
        spark.colorStep = Math.round(progress * 16);
      } else {
        spark.velocityX *= drag;
        spark.velocityY = spark.velocityY * drag + gravity * dt;
        if (spark.pattern === "saule") spark.velocityY += gravity * dt * 0.2;
        spark.x += spark.velocityX * dt;
        spark.y += spark.velocityY * dt;
      }

      if (
        (!spark.forming && spark.life >= spark.lifetime) ||
        (!spark.forming &&
          (spark.x < -40 ||
            spark.x > this.width + 40 ||
            spark.y > this.height + 60))
      ) {
        this.recycleSpark(index);
      }
    }
  }

  private updateAmbient(dt: number) {
    if (!this.ambient || this.options.reducedMotion) return;
    this.ambientElapsed += dt;
    const interval = this.options.lite ? 1.2 : 0.48;
    if (this.ambientElapsed < interval) return;
    this.ambientElapsed = 0;
    this.spawnSpark({
      x: Math.random() * this.width,
      y: this.height * (0.7 + Math.random() * 0.25),
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: -this.height * (0.05 + Math.random() * 0.045),
      lifetime: 3.5 + Math.random() * 2,
      pattern: "saule",
      finale: false,
      colorStep: Math.floor(Math.random() * COLORS.length),
    });
  }

  private createRestingSparks(count: number) {
    for (let index = 0; index < count; index++) {
      this.spawnSpark({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        velocityX: 0,
        velocityY: 0,
        lifetime: 2.4 + Math.random() * 1.8,
        pattern: "pivoine",
        finale: false,
        colorStep: Math.floor(Math.random() * 4),
      });
    }
  }

  private recycleSpark(index: number) {
    const lastIndex = this.active.length - 1;
    const spark = this.active[index];
    if (index !== lastIndex) this.active[index] = this.active[lastIndex];
    this.active.pop();
    spark.forming = false;
    this.pool.push(spark);
  }
}
