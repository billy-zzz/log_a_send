import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Log A Send',
    short_name: 'Log A Send',
    description: 'Track your boulder sends',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#f97316',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
