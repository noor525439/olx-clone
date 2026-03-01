import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border bg-white p-8 text-center shadow-sm">
      <div className="font-display text-2xl font-bold">Payment successful</div>
      <p className="mt-2 text-sm text-slate-600">Your order has been placed. Thank you!</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white" to="/products">
          Continue shopping
        </Link>
        <Link className="inline-flex h-11 items-center rounded-xl border px-4 text-sm font-semibold" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}

