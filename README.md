BitWatch – Bitcoin Block Explorer

BitWatch je web aplikacija tipa Block Explorer namijenjena pregledavanju i analizi Bitcoin blockchaina u stvarnom vremenu.
Aplikacija omogućuje pregled blokova, transakcija, adresa, mempoola te tržišnih podataka o kriptovalutama kroz moderno i responzivno korisničko sučelje.

Projekt koristi vlastiti backend koji se izravno povezuje na Bitcoin Core čvor putem RPC sučelja, bez oslanjanja na vanjske blockchain servise.

Funkcionalnosti

pregled najnovijih Bitcoin blokova u stvarnom vremenu

pretraga po broju bloka, hashu bloka, TXID-u ili Bitcoin adresi

detaljan prikaz transakcija
(ulazi, izlazi, naknade, fee rate, pripadni blok)

prikaz informacija o adresama
(saldo, UTXO zapisi, povijest transakcija)

mempool vizualizacija s grafovima
(vrijednost transakcija, distribucija fee rate-a)

prikaz tržišnih cijena kriptovaluta i povijesnih podataka
(CoinGecko API)

Korištene tehnologije
Backend

Node.js

Express.js

Bitcoin Core RPC

Server-Sent Events (SSE)

Frontend

React

React Router

Tailwind CSS

Recharts

Vanjski servisi

CoinGecko API (tržišni podaci kriptovaluta)

Preduvjeti

Prije pokretanja projekta potrebno je imati:

Node.js (v18 ili noviji)

pokrenut Bitcoin Core čvor s omogućenim RPC-jem

sinkroniziran blockchain (mainnet ili testnet)

Konfiguracija Bitcoin Core RPC-a

U konfiguracijskoj datoteci bitcoin.conf potrebno je omogućiti RPC:

server=1
rpcuser=your_rpc_user
rpcpassword=your_rpc_password
rpcport=8332

Pokretanje backend dijela

Pozicionirati se u backend direktorij

Instalirati ovisnosti:

npm install


Kreirati .env datoteku:

RPC_HOST=127.0.0.1
RPC_PORT=8332
RPC_USER=your_rpc_user
RPC_PASS=your_rpc_password


Pokrenuti server:

npm start


Backend je dostupan na:

http://localhost:3001

Pokretanje frontend dijela

Pozicionirati se u frontend direktorij

Instalirati ovisnosti:

npm install


Pokrenuti razvojni server:

npm run dev


Frontend je dostupan na:

http://localhost:5173


(ili drugom portu, ovisno o alatu)
