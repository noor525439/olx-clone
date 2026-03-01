import { Link } from 'react-router-dom';

export default function PaymentFailed() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border bg-white p-8 text-center shadow-sm">
      <div className="font-display text-2xl font-bold">Payment failed</div>
      <p className="mt-2 text-sm text-slate-600">Please try again or use another method.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white" to="/checkout">
          Try again
        </Link>
        <Link className="inline-flex h-11 items-center rounded-xl border px-4 text-sm font-semibold" to="/cart">
          Back to cart
        </Link>
      </div>
    </div>
  );
}

