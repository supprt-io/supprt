import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Supprt',
  description: 'Customer support made simple. Embeddable chat widget for any website.',

  // For custom domain (docs.supprt.io), base should be '/'
  // For GitHub Pages without custom domain, use '/supprt/'
  base: '/',

  // SEO: Generate sitemap
  sitemap: {
    hostname: 'https://docs.supprt.io',
  },

  // SEO: Canonical URL
  transformHead({ pageData }) {
    const canonicalUrl = `https://docs.supprt.io/${pageData.relativePath}`
      .replace(/\.md$/, '.html')
      .replace(/index\.html$/, '')

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['link', { rel: 'home', href: 'https://supprt.io' }],
    ['meta', { name: 'theme-color', content: '#2a9d8f' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Supprt' }],
    ['meta', { property: 'og:title', content: 'Supprt Documentation' }],
    ['meta', { property: 'og:description', content: 'Embeddable chat widget for any website. Works with React, Vue, Svelte, Angular, or vanilla JS.' }],
    ['meta', { property: 'og:image', content: 'https://supprt.io/og-docs.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:see_also', content: 'https://supprt.io' }],
    ['meta', { name: 'author', content: 'Supprt' }],
    ['meta', { name: 'publisher', content: 'Supprt' }],
    ['link', { rel: 'author', href: 'https://supprt.io' }],
    // JSON-LD structured data
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': 'https://docs.supprt.io/#documentation',
          'headline': 'Supprt Documentation',
          'description': 'Official documentation for Supprt - embeddable chat widget for customer support.',
          'url': 'https://docs.supprt.io',
          'author': { '@id': 'https://supprt.io/#organization' },
          'publisher': { '@id': 'https://supprt.io/#organization' },
          'mainEntityOfPage': 'https://docs.supprt.io',
          'about': { '@id': 'https://supprt.io/#software' },
        },
        {
          '@type': 'Organization',
          '@id': 'https://supprt.io/#organization',
          'name': 'Supprt',
          'url': 'https://supprt.io',
          'logo': 'https://supprt.io/logo.svg',
        },
        {
          '@type': 'WebSite',
          '@id': 'https://docs.supprt.io/#website',
          'url': 'https://docs.supprt.io',
          'name': 'Supprt Documentation',
          'description': 'Official documentation for Supprt widget',
          'publisher': { '@id': 'https://supprt.io/#organization' },
          'isPartOf': { '@id': 'https://supprt.io/#website' },
        },
      ],
    })],
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
          { text: 'llms.txt', link: '/llms.txt' },
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
      message: 'Released under the MIT License. <a href="https://supprt.io">← Back to Supprt.io</a>',
      copyright: 'Copyright © 2026 <a href="https://supprt.io">Supprt</a>'
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
