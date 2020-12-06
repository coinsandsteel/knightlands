<template>
  <div>
    <canvas ref="canvas" class="width-100 height-100" />
  </div>
</template>

<script>
import spine from "@/spine.js";
 
export default {
  props: {
    skeletonFile: String,
    skeletonName: String,
    atlas: String,
    atlasImage: String,
    translateY: {
      type: Number,
      default: 1.0
    },
    folder: String,
    binary: Boolean,
    useTriangleRendering: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.lastFrameTime = Date.now() / 1000;
  },
  data: () => ({
    ready: false
  }),
  watch: {
    skeletonFile: {
      immediate: true,
      handler() {
        if (this.skeletonFile) {
          if (this.binary) {
            this._getAssetManager().loadBinary(
              `animations/${this.wrapInFolder(this.skeletonFile)}.skel.bytes`
            );
          } else {
            this._getAssetManager().loadText(
              `animations/${this.wrapInFolder(this.skeletonFile)}.json`
            );
          }
          this.scheduleLoad();
        }
      }
    },
    skeletonName: {
      immediate: true,
      handler() {
        if (this.skeletonName) {
          this.skeleton = null;
          this.scheduleLoad();
        }
      }
    },
    atlas: {
      immediate: true,
      handler() {
        if (this.atlas) {
          this._getAssetManager().loadText(
            `animations/${this.wrapInFolder(this.atlas)}.atlas.txt`
          );
          this.scheduleLoad();
        }
      }
    },
    atlasImage: {
      immediate: true,
      handler() {
        if (this.atlasImage) {
          this._getAssetManager().loadTexture(
            `animations/${this.wrapInFolder(this.atlasImage)}.png`
          );
          this.scheduleLoad();
        }
      }
    }
  },
  mounted() {     
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext("2d");
      spine.canvas.SkeletonRenderer.useTriangleRendering = this.useTriangleRendering;
      this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context);
      // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
      this.skeletonRenderer.triangleRendering = this.useTriangleRendering;
      this.scheduleLoad();
    });
  },
  methods: {
    _getAssetManager() {
      if (!this.assetManager) {
        this.assetManager = new spine.canvas.AssetManager();
      }
      return this.assetManager;
    },
    scheduleLoad() {
      if (this._loadInterval) {
        return;
      }

      this.ready = false;
      this._loadInterval = setInterval(this.load.bind(this), 10);
    },
    wrapInFolder(file) {
      return this.folder ? `${this.folder}/${file}` : file;
    },
    isReady() {
      return this.ready;
    },
    getState() {
      return this.state;
    },
    load() {
      if (!this.skeleton && this.assetManager.isLoadingComplete()) {
        const { skeleton, state, bounds } = this.loadSkeleton(
          this.skeletonName,
          "default"
        );

        this.skeleton = skeleton;
        this.state = state;
        this.bounds = bounds;

        this.$emit("ready");
        this.ready = true;

        requestAnimationFrame(this.render.bind(this));
        clearInterval(this._loadInterval);
        this._loadInterval = null;
      }
    },
    loadSkeleton(name, initialAnimation, skin) {
      if (skin === undefined) skin = "default";
      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      let atlas = new spine.TextureAtlas(
        this.assetManager.get(
          `animations/${this.wrapInFolder(this.atlas)}.atlas.txt`
        ),
        path => {
          return this.assetManager.get("animations/" + this.wrapInFolder(path));
        }
      );

      // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
      let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      let skeletonData;
      if (this.binary) {
        skeletonData = new spine.SkeletonBinary(atlasLoader).readSkeletonData(
          this.assetManager.get(
            `animations/${this.wrapInFolder(name)}.skel.bytes`
          )
        );
      } else {
        skeletonData = new spine.SkeletonJson(atlasLoader).readSkeletonData(
          this.assetManager.get(`animations/${this.wrapInFolder(name)}.json`)
        );
      }

      var skeleton = new spine.Skeleton(skeletonData);
      skeleton.scaleY = -1;

      let bounds = this.calculateBounds(skeleton);
      skeleton.setSkinByName(skin);

      // Create an AnimationState, and set the initial animation in looping mode.
      let stateData = new spine.AnimationStateData(skeleton.data);
      stateData.defaultMix = 0.25;

      let animationState = new spine.AnimationState(stateData);
      //   animationState.addListener({
      //     event: (trackIndex, event) => {
      //       // spawn loot
      //       if (event.data.name == "spawn_loot") {
      //         this.showLoot = true;
      //       }
      //     },
      //     complete: function(trackIndex, loopCount) {},
      //     start: function(trackIndex) {
      //       // console.log("Animation on track " + trackIndex + " started");
      //     },
      //     end: function(trackIndex) {
      //       console.log("Animation on track " + trackIndex + " ended");
      //     }
      //   });
      // Pack everything up and return to caller.
      return { skeleton: skeleton, state: animationState, bounds: bounds };
    },
    resize() {
      var w = this.canvas.clientWidth;
      var h = this.canvas.clientHeight;
      if (this.canvas.width != w || this.canvas.height != h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }
      // magic
      // var centerX = this.bounds.offset.x + this.bounds.size.x / 2;
      // var centerY = this.bounds.offset.y + this.bounds.size.y / 2;
      var scaleX = this.bounds.size.x / this.canvas.width;
      var scaleY = this.bounds.size.y / this.canvas.height;
      var scale = Math.max(scaleX, scaleY);

      if (scale < 1) scale = 1;

      var width = this.canvas.width * scale;
      var height = this.canvas.height * scale;

      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.scale(1 / scale, 1 / scale);
      this.context.translate(width / 2, (height / 2) * this.translateY);
    },
    calculateBounds(skeleton) {
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform();
      var offset = new spine.Vector2();
      var size = new spine.Vector2();
      skeleton.getBounds(offset, size, []);
      return { offset: offset, size: size };
    },
    render() {
      if (!this.skeleton) {
        return;
      }

      var now = Date.now() / 1000;
      var delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      this.resize();

      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();

      this.state.update(delta);
      this.state.apply(this.skeleton);
      this.skeleton.updateWorldTransform();
      this.skeletonRenderer.draw(this.skeleton);

      requestAnimationFrame(this.render.bind(this));
    }
  }
};
</script>
