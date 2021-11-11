<script>
import anime from "animejs/lib/anime.es.js";

export default {
  methods: {
    async attract(attractable, at, to, container) {
      const overlay = container
        ? container
        : document.getElementById("overlay");
      const el = attractable.$el;
      overlay.appendChild(el);

      anime.set(el, {
        translateX: at.x,
        translateY: at.y
      });

      await attractable.show();

      let timeline = anime.timeline({
        targets: el
      });

      timeline.add({
        duration: 600,
        easing: "easeInQuart",
        "font-size": "2rem",
        translateX: to.x,
        translateY: to.y,
        opacity: {
          value: 0,
          easing: "easeInExpo"
        }
      });

      await timeline.finished;

      attractable.$destroy();
      overlay.removeChild(el);
    }
  }
};
</script>
