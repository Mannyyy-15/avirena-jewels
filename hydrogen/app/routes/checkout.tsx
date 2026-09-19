import {redirect} from 'react-router';
import type {Route} from './+types/checkout';

export async function loader({context}: Route.LoaderArgs) {
  const cart = await context.cart.get();
  if (cart?.checkoutUrl && cart?.totalQuantity && cart.totalQuantity > 0) {
    return redirect(cart.checkoutUrl);
  }
  return redirect('/cart');
}

export default function CheckoutRedirect() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <p className="font-serif text-xl text-[#413C23]">
        Redirecting to secure checkout...
      </p>
    </div>
  );
}
