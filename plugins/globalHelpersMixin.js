import Vue from 'vue';

Vue.mixin({
  methods: {
    prismicTitleHtml(prismicHtmlArray) {
      return prismicHtmlArray[0].text ? this.$prismic.asHtml(prismicHtmlArray) : ''
    }
  }
});
