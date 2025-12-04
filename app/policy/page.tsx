"use client";

export default function PolicyPage() {
  return (
    <div className="p-6 space-y-6 prose">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p>
        This Privacy Policy describes how the IOU app collects, uses, stores,
        and protects user information. By using the app you agree to data
        collection and use in line with this notice.
      </p>

      <h2>Data Collected</h2>
      <ul>
        <li>Manually entered records (descriptions, amounts, counterparty)</li>
        <li>Transaction type and settled status</li>
        <li>Anonymous technical information about the device</li>
      </ul>

      <h2>Use of Data</h2>
      <ul>
        <li>Improving the user experience</li>
        <li>Saving IOU records</li>
        <li>Secure synchronization through Supabase</li>
      </ul>

      <h2>Data Protection</h2>
      <p>Data is stored securely via Supabase and is not shared with unauthorised third parties.</p>

      <h2>User Rights</h2>
      <ul>
        <li>Request data deletion</li>
        <li>Request export or correction</li>
      </ul>

      <h2>Changes</h2>
      <p>The Privacy Policy may be updated periodically. Continued use of the app implies acceptance of changes.</p>

      <h2>Contact</h2>
      <p>Email: support@iouledger.app</p>
    </div>
  );
}
