"use client";

export default function DashboardContent() {
  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">IOU Ledger</h1>

      <div className="space-y-4">
        <p>Benvenuto! Usa il menu per aggiungere e vedere IOU.</p>

        <a
          href="/add"
          className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-semibold"
        >
          ➕ Aggiungi IOU
        </a>

        <a
          href="/history"
          className="block bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-xl text-center font-semibold"
        >
          📄 Storico IOU
        </a>
      </div>
    </div>
  );
}
