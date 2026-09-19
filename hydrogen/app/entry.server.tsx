import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    defaultSrc: ["'self'", 'https://cdn.shopify.com'],
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://connect.facebook.net',
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://monorail-edge.shopifysvc.com',
      `https://${context.env.PUBLIC_STORE_DOMAIN}`,
      `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}`,
      'https://avirenajewels.com',
      'https://checkout.avirenajewels.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.google.com',
      'https://*.google.co.in',
      'https://www.facebook.com',
      'https://*.facebook.com',
      'https://*.facebook.net',
      'https://connect.facebook.net',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.shopify.com',
      'https://images.unsplash.com',
      'https://www.facebook.com',
      'https://*.facebook.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
    ],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.shopify.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.shopify.com', 'https://fonts.googleapis.com'],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
