import type { RouterConfig } from '@nuxt/schema'

// Custom router options to ensure 404 handling works correctly with i18n
export default <RouterConfig> {
  routes: (_routes) => {
    // Add a catch-all route at the end to handle any unmatched paths
    // This suppresses the "No match found" warning by providing a valid route
    return [
      ..._routes,
      {
        name: 'force-catch-all',
        path: '/:pathMatch(.*)*',
        component: () => import('~/pages/[...slug].vue').then(r => r.default || r)
      }
    ]
  }
}
