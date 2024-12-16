import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";

import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type { Options as BlogPluginOptions } from "@docusaurus/plugin-content-blog";
import type { Options as PagesPluginOptions } from "@docusaurus/plugin-content-pages";
import type { Options as SitemapPluginOptions } from "@docusaurus/plugin-sitemap";
//import type { Options as GtagPluginOptions } from "@docusaurus/plugin-google-gtag";
//import type { Options as GTMPluginOptions } from "@docusaurus/plugin-google-tag-manager";
import type { ThemeConfig as BaseThemeConfig } from "@docusaurus/types";
import type { UserThemeConfig as ClassicThemeConfig } from "@docusaurus/theme-common";
import type { Options as ThemeOptions } from "@docusaurus/theme-classic";
import type { PluginOptions as SearchOptions } from "@easyops-cn/docusaurus-search-local";

var deployURL = process.env.OKD_DEPLOY_URL;
var deployOrigin = "https://okd.io";
var deployPath = "/";
if(deployURL) {
  const parsedURL = new URL(deployURL);
  const parsedOrigin = parsedURL.origin;
  if(parsedOrigin) {
    deployOrigin = parsedOrigin;
  }
  const parsedPath = parsedURL.pathname;
  if(parsedPath) {
    deployPath = parsedPath;
  }
}

var currentRepository = process.env.GITHUB_REPOSITORY
var editUrl = "https://github.com/okd-project/okd-web/tree/main/"
if(currentRepository) {
  editUrl = "https://github.com/" + currentRepository + "/tree/main/"
}

const config: Config = {
  title: "OKD Kubernetes Platform",
  tagline: "Deploy at scale on any infrastructure",

  future: {
    experimental_faster: true,
  },
  
  // Defined manually for compatibility reasons
  //favicon: "favicon.ico",

  url: deployOrigin,
  baseUrl: deployPath,

  organizationName: "okd-project", // Usually your GitHub org/user name.
  projectName: "okd-web", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "throw",
  onDuplicateRoutes: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: [
    [
      "@docusaurus/theme-classic",
      {
        customCss: "./src/css/custom.scss",
      } satisfies ThemeOptions,
    ],
    "@docusaurus/theme-mermaid",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
      } satisfies SearchOptions,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    announcementBar: {
      id: 'scos-notice',
      content: 'OKD 4.17 and 4.16 now available: <a href="/blog/2024/12/16/okd-4-16-and-4-17-release">read here</a>.',
      backgroundColor: '#666',
      textColor: '#fff',
      isCloseable: false,
    },
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },

    image: "img/brand/social-card.jpg",

    navbar: {
      title: "OKD",
      logo: {
        alt: "OKD Panda Mascot",
        src: "img/brand/mascot/mascot_rocket.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "projectSidebar",
          position: "left",
          label: "About",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "productDocsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          type: "docSidebar",
          sidebarId: "operatorsSidebar",
          position: "left",
          label: "Operators",
        },
        {
          type: "docSidebar",
          sidebarId: "communitySidebar",
          position: "left",
          label: "Community",
        },
        
        {
          label: "Enterprise",
          href: "https://www.redhat.com/en/technologies/cloud-computing/openshift?utm_source=okd&utm_medium=link&utm_campaign=enterprise&utm_content=top_bar",
          position: "right",
        }
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Docs",
              to: "/docs/project/",
            },
            {
              label: "Latest Product Docs",
              to: "https://docs.okd.io/latest/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "K8s Slack (#okd-dev)",
              href: "https://slack.k8s.io/",
            },
            {
              label: "Google Group",
              href: "https://groups.google.com/g/okd-wg",
            },
            {
              label: "X/Twitter",
              href: "https://twitter.com/okd_io",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/okd-project",
            },
            {
              label: "Site Debug",
              href: "/__docusaurus/debug"
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OKD Contributors & Red Hat.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash'],
    },
  } satisfies BaseThemeConfig & ClassicThemeConfig,

  markdown: {
    mermaid: true,
    //format: 'detect',
  },

  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-content-docs",
      {
        sidebarPath: "./docs/sidebars.ts",
        editUrl: editUrl,
      } satisfies DocsPluginOptions,
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        path: 'blog',
        blogDescription: "Updates from the OKD team on development",
        showReadingTime: true,
      
        editUrl: editUrl,
      } satisfies BlogPluginOptions,
    ],

    ["@docusaurus/plugin-content-pages", {} satisfies PagesPluginOptions],

    //['google-gtag', {} satisfies GtagPluginOptions],
    //['google-tag-manager', {} satisfies GTMPluginOptions],

    [
      "@docusaurus/plugin-sitemap",
      {
        //lastmod: 'date',
        //changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ["/tags/**"],
        filename: "sitemap.xml",
      } satisfies SitemapPluginOptions,
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    "@docusaurus/plugin-debug",
    [
      '@docusaurus/plugin-pwa',
      {
        debug: process.env.NODE_ENV !== 'production',
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
      },
    ],
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: 'favicon.ico',
        sizes: "32x32"
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: 'img/brand/logo/o-icon.svg',
        type: "image/svg+xml"
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: 'img/brand/solid-icon-180x',
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: 'manifest.json',
      }
    },
    {
      tagName: 'base',
      attributes: {
        href: deployPath
      }
    }
  ]
};

export default config;
