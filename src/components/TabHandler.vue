<script>
export default {
  data: () => ({
    currentTab: "",
    tabs: []
  }),
  methods: {
    handleTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>