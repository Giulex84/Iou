"use client";

export default function TermsPage() {
  return (
    <div className="p-6 space-y-6 prose">
      <h1 className="text-3xl font-bold">Terms of Service</h1>

      <p>
        Utilizzando IOU Ledger Pro accetti i presenti Termini di Servizio. Se
        non accetti, non utilizzare l’app.
      </p>

      <h2>Uso Consentito</h2>
      <ul>
        <li>L’app deve essere usata per registrare IOU personali.</li>
        <li>È vietato un uso illecito o fraudolento.</li>
        <li>L’utente è responsabile delle informazioni inserite.</li>
      </ul>

      <h2>Limitazioni</h2>
      <ul>
        <li>
          L’app non è responsabile per la perdita di dati derivante da utilizzo
          improprio.
        </li>
        <li>
          Nessuna garanzia viene fornita sulla disponibilità continua del
          servizio.
        </li>
      </ul>

      <h2>Pagamenti</h2>
      <p>
        Eventuali funzioni premium o pagamenti Pi vengono gestiti esclusivamente
        tramite i sistemi ufficiali della Pi Network. L’app non memorizza dati
        bancari.
      </p>

      <h2>Modifiche ai Termini</h2>
      <p>
        I Termini possono essere aggiornati in qualsiasi momento. Continuando a
        usare l’app, accetti tali modifiche.
      </p>

      <h2>Contatti</h2>
      <p>Email: support@iouledger.app</p>
    </div>
  );
}
