const pkg = require('./package');
const prismicConfig = require('./prismic-configuration');
const Prismic = require('prismic-javascript');


module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/mediaQueries',
    { src: '~plugins/modals', ssr: false },
    '~plugins/touchEvents',
    '~plugins/globalHelpersMixin'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    ['prismic-nuxt', {
      endpoint: prismicConfig.apiEndpoint,
      linkResolver: prismicConfig.linkResolver
    }]
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
