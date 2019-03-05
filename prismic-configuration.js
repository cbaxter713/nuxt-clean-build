const prismicConfig = {
  apiEndpoint: 'https://thor-website.cdn.prismic.io/api/v2',
  accessToken: 'MC5YRGU4NVJBQUFDRUFXOG9L.Dxzvv70v77-9JQtFZ--_ve-_ve-_vTtP77-9fO-_vSXvv703HwHvv73vv71v77-977-977-9XALvv73vv70',
  linkResolver: function (doc) {
    if (doc.isBroken) { return '/not-found' }
    if (doc.type === 'content_page') {

      switch (doc.uid) {
        case 'home-page':
          return '/';
          break;
        default:
          return `/${doc.uid}`;
      }
    }
    if (doc.type === 'brand_landing') { return '/brands' }
    if (doc.type === 'brand') { return '/brands/' + doc.uid }
    if (doc.type === 'rv_type_landing') { return '/rv-types' }
    if (doc.type === 'rv_type') { return '/rv-types/' + doc.uid }
    if (doc.type === 'news_landing') { return '/news-events' }
    if (doc.type === 'news') { return '/news-events/' + doc.uid }
    if (doc.type === 'story_landing') { return '/stories' }
    if (doc.type === 'story_category') { return `/stories/category/${doc.uid}`}
    if (doc.type === 'story') { return `/stories/${doc.uid}` }
    if (doc.type === 'rv_page' && doc.uid === 'rv-finder-landing') { return '/find-my-rv' }
    if (doc.type === 'contact') { return '/contact-us'}
    return '/'
  }
};

module.exports = prismicConfig;
