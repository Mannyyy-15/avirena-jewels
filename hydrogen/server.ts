import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

const LEGACY_REDIRECTS: Record<string, string> = {
  '/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings':
    '/product/avirena-square-studs-gold-tone-brass-earrings',
  '/product/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings':
    '/product/avirena-drop-earrings-gold-tone-brass',
  '/product/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings':
    '/product/avirena-statement-drops-geometric-brass-earrings',
  '/product/nadir-square-studs-gold-tone-brass-earrings':
    '/product/avirena-square-studs-gold-tone-brass-earrings',
  '/product/lume-drop-earrings-gold-tone-brass':
    '/product/avirena-drop-earrings-gold-tone-brass',
  '/product/forma-statement-drops-geometric-brass-earrings':
    '/product/avirena-statement-drops-geometric-brass-earrings',
  '/product/amara-heart-drops-silver-tone-earrings':
    '/product/avirena-heart-drops-silver-tone-earrings',
  '/product/volute-spiral-earrings-silver-tone':
    '/product/avirena-spiral-earrings-silver-tone',
  '/product/solene-crystal-hoops-gold-tone-earrings':
    '/product/avirena-crystal-hoops-gold-tone-earrings',
  '/product/solene-crystal-hoops-silver-tone-earrings':
    '/product/avirena-crystal-hoops-silver-tone-earrings',
  '/product/petra-pebble-studs-gold-tone-earrings':
    '/product/avirena-pebble-studs-gold-tone-earrings',
  '/product/foglia-leaf-studs-gold-tone-earrings':
    '/product/avirena-leaf-studs-gold-tone-earrings',
  '/products/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings':
    '/products/avirena-square-studs-gold-tone-brass-earrings',
  '/products/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings':
    '/products/avirena-drop-earrings-gold-tone-brass',
  '/products/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings':
    '/products/avirena-statement-drops-geometric-brass-earrings',
  '/products/nadir-square-studs-gold-tone-brass-earrings':
    '/products/avirena-square-studs-gold-tone-brass-earrings',
  '/products/lume-drop-earrings-gold-tone-brass':
    '/products/avirena-drop-earrings-gold-tone-brass',
  '/products/forma-statement-drops-geometric-brass-earrings':
    '/products/avirena-statement-drops-geometric-brass-earrings',
  '/products/amara-heart-drops-silver-tone-earrings':
    '/products/avirena-heart-drops-silver-tone-earrings',
  '/products/volute-spiral-earrings-silver-tone':
    '/products/avirena-spiral-earrings-silver-tone',
  '/products/solene-crystal-hoops-gold-tone-earrings':
    '/products/avirena-crystal-hoops-gold-tone-earrings',
  '/products/solene-crystal-hoops-silver-tone-earrings':
    '/products/avirena-crystal-hoops-silver-tone-earrings',
  '/products/petra-pebble-studs-gold-tone-earrings':
    '/products/avirena-pebble-studs-gold-tone-earrings',
  '/products/foglia-leaf-studs-gold-tone-earrings':
    '/products/avirena-leaf-studs-gold-tone-earrings',
};

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      const destination = LEGACY_REDIRECTS[url.pathname];
      if (destination) {
        return Response.redirect(`${url.origin}${destination}`, 301);
      }

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Hydrogen request handler that internally
       * delegates to React Router for routing and rendering.
       */
      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
