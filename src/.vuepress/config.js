const { description } = require('../../package');
const fs = require("fs");
const path = require("path");

module.exports = {
  base: process.env.VUEPRESS_BASE || '/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Elementos de Desarrollo Web',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: 'Última modificación',
    nav: [
      {
        text: 'Guía',
        link: '/guia/',
      },
      {
        text: 'Referencias',
        link: '/referencias/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/akobashikawa/curso-elementos-desarrollo-web'
      }
    ],
    sidebar: 'auto'
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: {
    '@vuepress/plugin-back-to-top': {},
    '@vuepress/plugin-medium-zoom': {},
    'internal-link': {
      linkPattern: /\[\[([\w\s/-]+)(\|(([\w\s/-])+))?\]\]/
    }
  }
}

function getSideBar(folder, title, desc) {
  const extension = [".md"];

  let files = fs
    .readdirSync(path.join(`${__dirname}/../${folder}`))
    .filter(
      (item) =>
        item.toLowerCase() != "readme.md" &&
        fs.statSync(path.join(`${__dirname}/../${folder}`, item)).isFile() &&
        extension.includes(path.extname(item))
    );

  if (desc) {
    files = files.reverse();
  }

  return [{ title: title, children: ["", ...files] }];
}

// https://github.com/vuejs/vuepress/issues/1491#issuecomment-538759489
// modificado por akobashikawa@gmail.com
// copia todas las imagenes a public en sus respectivas carpetas

// const fs = require("fs");
// const path = require("path");

function copyStaticFilesToPublic() {
  const doNotDeleteFolderNames = [new RegExp("^(img)$")];
  const doNotCopyFilenames = [new RegExp("^.*\\.md$")];

  const doNotCopyFolderNames = [new RegExp("^(\\.vuepress|\\.obsidian)$")];

  const pathToPublicFolder = path.resolve(__dirname, "public");
  const pathToSrcFolder = path.resolve(__dirname, "../");

  if (fs.existsSync(pathToPublicFolder)) {
    const names = fs.readdirSync(pathToPublicFolder);

    for (const name of names) {
      if (!doNotDeleteFolderNames.some((regexp) => regexp.test(name))) {
        const pathToFolderName = path.resolve(pathToPublicFolder, name);
        fs.rmdirSync(pathToFolderName, { recursive: true }); // Requires latest version of node.
      }
    }

  }

  copyAllStaticFiles(pathToSrcFolder, pathToPublicFolder);

  function copyAllStaticFiles(pathToSourceFolder, pathToDestinationFolder) {
    if (!fs.existsSync(pathToDestinationFolder)) {
      fs.mkdirSync(pathToDestinationFolder);
    }

    const names = fs.readdirSync(pathToSourceFolder);

    for (const name of names) {
      const pathToSource = path.resolve(pathToSourceFolder, name);
      const pathToDestination = path.resolve(pathToDestinationFolder, name);

      if (fs.lstatSync(pathToSource).isDirectory()) {
        if (!doNotCopyFolderNames.some((regexp) => regexp.test(name))) {
          copyAllStaticFiles(pathToSource, pathToDestination);
        }
      } else {
        if (!doNotCopyFilenames.some((regexp) => regexp.test(name))) {
          fs.copyFileSync(pathToSource, pathToDestination);
        }
      }
    }
  }
}

copyStaticFilesToPublic();
console.log("config.js runned");