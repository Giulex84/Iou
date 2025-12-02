"use client";

export default function PolicyPage() {
  return (
    <div className="p-6 space-y-6 prose">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p>
        La presente Privacy Policy descrive come IOU Ledger Pro raccoglie,
        utilizza, conserva e protegge le informazioni personali degli utenti.
        Utilizzando l’app accetti la raccolta e l’uso dei dati in conformità con
        questa informativa.
      </p>

      <h2>Dati Raccolti</h2>
      <ul>
        <li>Dati inseriti manualmente (nomi, importi, note)</li>
        <li>Valute e categorie utilizzate</li>
        <li>Informazioni tecniche anonime del dispositivo</li>
      </ul>

      <h2>Utilizzo dei Dati</h2>
      <ul>
        <li>Miglioramento dell’esperienza utente</li>
        <li>Memorizzazione degli IOU</li>
        <li>Sincronizzazione sicura tramite Firebase</li>
      </ul>

      <h2>Protezione dei Dati</h2>
      <p>
        I dati sono archiviati in maniera sicura tramite Firebase e non vengono
        condivisi con terze parti non autorizzate.
      </p>

      <h2>Diritti dell’Utente</h2>
      <ul>
        <li>Richiedere l’eliminazione dei dati</li>
        <li>Richiedere esportazione o correzione</li>
      </ul>

      <h2>Modifiche</h2>
      <p>
        La Privacy Policy può essere aggiornata periodicamente. L’uso continuato
        dell’app implica l’accettazione delle modifiche.
      </p>

      <h2>Contatti</h2>
      <p>Email: support@iouledger.app</p>
    </div>
  );
}
