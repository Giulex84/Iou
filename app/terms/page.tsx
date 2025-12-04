"use client";

export default function TermsPage() {
  return (
    <div className="p-6 space-y-6 prose">
      <h1 className="text-3xl font-bold">Terms of Service</h1>

      <p>
        By using the IOU app you agree to these Terms of Service. If you do not
        agree, do not use the app.
      </p>

      <h2>Permitted Use</h2>
      <ul>
        <li>The app is for recording personal IOUs.</li>
        <li>Illegal or fraudulent use is prohibited.</li>
        <li>Users are responsible for the information they enter.</li>
      </ul>

      <h2>Limitations</h2>
      <ul>
        <li>The app is not responsible for data loss due to misuse.</li>
        <li>No guarantee is provided regarding continuous availability.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Any premium features or Pi payments are handled exclusively through the
        official Pi Network systems. The app does not store banking data.
      </p>

      <h2>Changes to the Terms</h2>
      <p>
        Terms may be updated at any time. Continuing to use the app means you
        accept these changes.
      </p>

      <h2>Contact</h2>
      <p>Email: support@iouledger.app</p>
    </div>
  );
}
