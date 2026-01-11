import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Supprt',
  description: 'Customer support made simple. Embeddable chat widget for any website.',

  // For custom domain, remove base. For GitHub Pages without custom domain, use '/supprt/'
  // base: '/supprt/',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#14b8a6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Supprt' }],
    ['meta', { property: 'og:title', content: 'Supprt - Customer support made simple' }],
    ['meta', { property: 'og:description', content: 'Embeddable chat widget for any website. Works with React, Vue, Svelte, Angular, or vanilla JS.' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/configuration' },
      { text: 'Frameworks', link: '/frameworks/react' },
      {
        text: 'Links',
        items: [
          { text: 'Dashboard', link: 'https://app.supprt.io' },
          { text: 'GitHub', link: 'https://github.com/supprt-io/supprt' },
          { text: 'npm', link: 'https://www.npmjs.com/package/@supprt/widget' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Supprt?', link: '/guide/what-is-supprt' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Installation',
          items: [
            { text: 'Script Tag', link: '/guide/installation-script' },
            { text: 'npm Package', link: '/guide/installation-npm' },
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'User Identification', link: '/guide/user-identification' },
            { text: 'Customization', link: '/guide/customization' },
            { text: 'Events', link: '/guide/events' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Configuration', link: '/api/configuration' },
            { text: 'Methods', link: '/api/methods' },
            { text: 'Events', link: '/api/events' },
            { text: 'Types', link: '/api/types' },
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'Framework Guides',
          items: [
            { text: 'React', link: '/frameworks/react' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Angular', link: '/frameworks/angular' },
            { text: 'Next.js', link: '/frameworks/nextjs' },
            { text: 'Nuxt', link: '/frameworks/nuxt' },
            { text: 'Astro', link: '/frameworks/astro' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/supprt-io/supprt' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Supprt'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/supprt-io/supprt/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
