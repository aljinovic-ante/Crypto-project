# BitWatch – Bitcoin Blockchain Explorer

## Project Description

**BitWatch** is a web-based application designed for real-time exploration, monitoring, and analysis of the Bitcoin blockchain. The primary purpose of the project is to provide users with a clear and structured overview of blockchain data while demonstrating practical knowledge of how Bitcoin operates at a protocol and data level.

<img width="945" height="390" alt="image" src="https://github.com/user-attachments/assets/27515e52-f3db-4a51-8b23-1c08832a5b7f" />

The application enables users to search and inspect core blockchain entities such as **blocks**, **transactions**, and **Bitcoin addresses** through a simple, intuitive, and responsive user interface. Users can perform searches by entering a block height, block hash, transaction ID (TXID), or a Bitcoin address. Based on the input type, the system automatically resolves the query and retrieves the corresponding data.

For **blocks**, the application displays detailed technical and statistical information, including block height, hash, timestamp, size, weight, difficulty, nonce, number of transactions, miner identification (extracted from the coinbase transaction), block reward, and aggregated fee statistics. All transactions contained within the block are listed and can be individually inspected.
<img width="945" height="702" alt="image" src="https://github.com/user-attachments/assets/525d8267-9b58-42b6-8ba2-d49a5ce7d801" />


For **transactions**, BitWatch provides a full breakdown of transaction data, including confirmation status, block inclusion, size, fee, fee rate, number of inputs and outputs, total input and output values, and precise Bitcoin addresses involved. Inputs and outputs are displayed separately, allowing users to clearly track the flow of funds within the transaction and across the blockchain.
<img width="945" height="652" alt="image" src="https://github.com/user-attachments/assets/ddef81f1-facf-421c-990e-0b36baeedd03" />


For **Bitcoin addresses**, the application presents a concise financial overview, including current balance, total received amount, total sent amount, and transaction count. Additionally, the system lists all **unspent transaction outputs (UTXO)** associated with the address, representing spendable funds, as well as a history of recent transactions linked to that address.
<img width="945" height="624" alt="image" src="https://github.com/user-attachments/assets/8d7f1c97-485d-4860-88fd-e6e1371c32d5" />


The application also includes a **Mempool section**, which visualizes the current state of the Bitcoin mempool — a pool of unconfirmed transactions awaiting inclusion in a block. This section provides summary statistics such as total transaction value, average and median fee rates (in sat/vB), and graphical representations of fee distribution and transaction volume over time. For performance reasons, the list of displayed mempool transactions is limited to the most recent 100 entries, while the underlying data is continuously updated.
<img width="945" height="636" alt="image" src="https://github.com/user-attachments/assets/cc618dd4-a1fc-4602-a8cf-b3bb23f6e327" />


In addition to blockchain inspection, BitWatch offers an **Exchange module**, which allows users to check the current market value of selected cryptocurrencies against fiat currencies. The module displays the current price along with a line chart showing price movements over the last 30 days. These market data features are intended as an informative complement to the core blockchain functionality.
<img width="945" height="639" alt="image" src="https://github.com/user-attachments/assets/d17b190e-8beb-4c52-b0ca-9b2a574011f2" />



## Key Features

- Search by block height, block hash, transaction ID, or Bitcoin address
- Real-time display of newly mined blocks using SSE
- Detailed block, transaction, and address inspection
- Mempool visualization with fee statistics and transaction analysis
- Cryptocurrency price tracking with 30-day historical charts
- Responsive and modern user interface


## Technologies Used

### Backend
- Node.js
- Express.js
- Bitcoin Core RPC
- Server-Sent Events (SSE)

### Frontend
- React
- React Router
- Tailwind CSS

### External APIs
- CoinGecko API (market data)

### How to start this app:
## Backend
cd app
node server.js

## Frontend
cd app
npm start
