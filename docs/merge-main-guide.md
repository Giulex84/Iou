# Come fare un merge completo su `main`

Questi passaggi assumono che tu abbia i permessi di push sul repository remoto `origin` e che il branch di lavoro attuale si chiami `work`.

1. **Aggiorna i rami locali**
   ```bash
   git fetch origin
   ```
2. **Sincronizza `main` con il remoto**
   ```bash
   git checkout main
   git pull --ff-only origin main
   ```
   Usa `--ff-only` per evitare merge inattesi; se fallisce, risolvi prima le differenze o usa un merge esplicito.
3. **Aggiorna il branch di lavoro con le ultime modifiche di `main`**
   ```bash
   git checkout work
   git merge --no-ff main
   ```
   Risolvi eventuali conflitti, poi continua:
   ```bash
   git add <file>
   git commit
   ```
4. **Esegui test e verifiche locali** (ad es. lint, unit test, build) per assicurarti che lo stato sia stabile.
5. **Esegui il merge del branch di lavoro su `main`**
   ```bash
   git checkout main
   git merge --no-ff work
   ```
   Se preferisci un merge fast-forward (e il branch è in coda), sostituisci con `git merge --ff-only work`.
6. **Spingi `main` aggiornato**
   ```bash
   git push origin main
   ```

### Consigli aggiuntivi
- Se lavori tramite Pull Request, dopo il punto 3 apri la PR e lascia che sia il processo di review/CI a gestire l'unione su `main`.
- Per mantenere la storia pulita puoi rimpiazzare il punto 3 con un rebase (`git rebase main`), purché il branch non sia già condiviso.
