<template>
    <div>
      <canvas ref="canvas" class="width-100 height-100">

      </canvas>
    </div>
</template>

<script>
import spine from "@/spine.js";

export default {
props: ["skeletonFile", "skeletonName", "atlas", "atlasImage", "translateY"],
  created() {
    this.lastFrameTime = Date.now() / 1000;
  },
  mounted() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext("2d");
      this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context);
      // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
      this.skeletonRenderer.triangleRendering = false;

      this.assetManager = new spine.canvas.AssetManager();
      this.assetManager.loadText(`animations/${this.skeletonFile}.json`);
      this.assetManager.loadText(`animations/${this.atlas}.atlas.txt`);
      this.assetManager.loadTexture(`animations/${this.atlasImage}.png`);

      requestAnimationFrame(this.load.bind(this));
    });
  },
  methods: {
      getState() {
          return this.state;
      },
    load() {
      if (this.assetManager.isLoadingComplete()) {
        var data = this.loadSkeleton(
          this.skeletonName,
          "default"
        );

        this.skeleton = data.skeleton;
        this.state = data.state;
        this.bounds = data.bounds;

        this.$emit("ready");

        requestAnimationFrame(this.render.bind(this));
      } else {
        requestAnimationFrame(this.load.bind(this));
      }
    },
    loadSkeleton(name, initialAnimation, skin) {
      if (skin === undefined) skin = "default";
      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      let atlas = new spine.TextureAtlas(
        this.assetManager.get(`animations/${this.atlas}.atlas.txt`),
        path => {
          return this.assetManager.get("animations/" + path);
        }
      );

      // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
      let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(atlasLoader);
      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      var skeletonData = skeletonJson.readSkeletonData(
        this.assetManager.get("animations/" + name + ".json")
      );

      var skeleton = new spine.Skeleton(skeletonData);
      skeleton.scaleY = -1;

      let bounds = this.calculateBounds(skeleton);
      skeleton.setSkinByName(skin);

      // Create an AnimationState, and set the initial animation in looping mode.
      var animationState = new spine.AnimationState(
        new spine.AnimationStateData(skeleton.data)
      );

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
      var centerX = this.bounds.offset.x + this.bounds.size.x / 2;
      var centerY = this.bounds.offset.y + this.bounds.size.y / 2;
      var scaleX = this.bounds.size.x / this.canvas.width;
      var scaleY = this.bounds.size.y / this.canvas.height;
      var scale = Math.max(scaleX, scaleY);

      if (scale < 1) scale = 1;

      var width = this.canvas.width * scale;
      var height = this.canvas.height * scale;

      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.scale(1 / scale, 1 / scale);
      this.context.translate(width / 2, height / 2);
    },
    calculateBounds(skeleton) {
      var data = skeleton.data;
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform();
      var offset = new spine.Vector2();
      var size = new spine.Vector2();
      skeleton.getBounds(offset, size, []);
      return { offset: offset, size: size };
    },
    render() {
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