<template lang="html">
  <div class="width-100 height-100">
    <canvas
      :id="id"
      :width="width"
      :height="height"
      ref="vue-sprite-canvas"
    ></canvas>
  </div>
</template>

<script>
class SpriteResource {
  constructor(sprite, atlas) {
    this.spritesheet = sprite;
    this.frameIndex = 0;

    this.frames = atlas.frames.map(frame => {
      return {
        name: frame.filename,
        x: frame.frame.x,
        y: frame.frame.y,
        w: frame.frame.w,
        h: frame.frame.h
      };
    });

    this.frames.sort((a, b) => a.filename < b.filename);
    this.width = this.frames[0].w;
    this.height = this.frames[0].h;
    this.length = this.frames.length - 1;
  }

  async load() {
    this.sprite = new Image();
    this.sprite.src = this.spritesheet;
    return new Promise(resolve => {
      this.sprite.onload = () => {
        resolve();
      };
    });
  }
}

class Sprite {
  constructor(resource) {
    this.resource = resource;
    this.reset();
    this.x = 0;
    this.y = 0;
  }

  reset() {
    this.frameIndex = 0;
  }

  render(ctx) {
    const index = Math.abs(this.frameIndex % this.resource.length);
    const { x: fx, y: fy, w: fw, h: fh } = this.resource.frames[index];
    ctx.drawImage(this.resource.sprite, fx, fy, fw, fh, this.x, this.y, fw, fh);
    this.frameIndex++;
    return this.frameIndex >= this.resource.length;;
  }
}

export default {
  name: "v-sprite",
  props: {
    spritesheet: {
      required: true,
      type: Array
    },
    json: {
      required: true,
      type: Array
    },
    fps: {
      type: Number,
      default: 30
    },
    id: {
      type: String,
      default: "vue-sprite"
    },
    loops: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      animationFrameID: null,
      sprite: null,
      ctx: null,
      now: 0,
      then: 0,
      width: 0,
      height: 0
    };
  },
  async mounted() {
    this.sprites = [];
    this.resources = [];
    for (let i = 0; i < this.spritesheet.length; ++i) {
      let res = new SpriteResource(this.spritesheet[i], this.json[i]);
      this.resources.push(res);
    }

    await Promise.all(this.resources.map(x => x.load()));

    this.width = this.$el.offsetWidth;
    this.height = this.$el.offsetHeight;
    this.init();
  },
  methods: {
    init() {
      this.ctx = this.$refs["vue-sprite-canvas"].getContext("2d");
    },
    render() {
      if (!this.ctx) {
        return;
      }
      this.ctx.clearRect(0, 0, this.width, this.height);
    },
    loop() {
      this.now = Date.now();
      const delta = this.now - this.then;
      if (delta > 1000 / this.fps) {
        this.then = this.now - (delta % (1000 / this.fps));

        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.sprites.length; i++) {
          const sprite = this.sprites[i];
          if (sprite.render(this.ctx)) {
            this.sprites.splice(i, 1);
            i--;
          }
        }
      }

      if (this.sprites.length > 0) {
        this.animationFrameID = window.requestAnimationFrame(this.loop);
      } else {
        this.stop();
      }
    },
    stop() {
      window.cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = undefined;
      this.sprites.length = 0;
      this.ctx.clearRect(0, 0, this.width, this.height);
    },
    play() {
      let res = this.resources[
        Math.floor(Math.random() * this.resources.length)
      ];
      let sprite = new Sprite(res);
      // randomize position inside the canvas
      sprite.x = Math.random() * (this.width - res.width);
      sprite.y = Math.random() * (this.height - res.height);
      this.sprites.push(sprite);
      if (!this.animationFrameID) {
        this.loop();
      }
    }
  }
};
</script>
