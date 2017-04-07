const fs = require('fs');
const glob = require('glob');
const moment = require('moment');
const path = require('path');
const util = require('hexo-util');
const yaml = require('js-yaml');

hexo.extend.generator.register('plants', function(locals){
  const base = 'plants';
  const data = yaml.safeLoad(fs.readFileSync('plants.yml'));
  const pages = [];

  // Plants index page.
  data.title = 'My Plants - Berry Gardener'
  pages.push({
    path: `/${base}/`,
    data,
    layout: ['plants']
  });

  // Plants data file.
  pages.push({
    path: `/${base}.yml`,
    data: () => fs.createReadStream('plants.yml')
  });

  // Individual cultivar pages.
  for (const category of data.categories) {
    const catName = util.slugize(category.name, {transform: 1});

    // Generate image filenames
    for (const filename of glob.sync(`plants/${catName}/*.jpg`)) {
      const basename = path.basename(filename);
      const url = `/${base}/${catName}-${basename}`;

      pages.push({
        path: url,
        data: () => fs.createReadStream(filename)
      });
    }

    for (const cultivar of category.cultivars) {
      const plantName = util.slugize(cultivar.name, {transform: 1});

      // Slug to reference a cultivar
      cultivar.slug = `${catName}-${plantName}`;

      // Generate URL for linking
      cultivar.url = `/${base}/${catName}/${plantName}/`;

      // Generate day-of-year integer from dates, useful for drawing.
      for (const type of ['bud', 'bloom', 'harvest']) {
        cultivar.dates[type].range = cultivar.dates[type].range.map(i =>
          parseInt(moment(i, 'D MMM').format('DDD'), 10));
      }

      // Generate image filenames
      cultivar.images = [];
      for (const filename of glob.sync(`plants/${catName}/${plantName}/*`).sort()) {
        const basename = path.basename(filename).replace(/^[0-9]+-/, '');
        const url = `/${base}/${catName}-${plantName}-${basename}`;

        cultivar.images.push({url});

        pages.push({
          path: url,
          data: () => fs.createReadStream(filename)
        });
      }

      pages.push({
        path: cultivar.url,
        data: {
          title: `${cultivar.name} ${category.name} - Berry Gardener`,
          category,
          cultivar
        },
        layout: ['cultivar']
      });
    }
  }

  return pages;
});
