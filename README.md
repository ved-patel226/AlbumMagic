# Album Magic

## Prerequisites

Before installing, ensure you have the following installed on your system:

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

You will also need a [Spotify Developer Account](https://developer.spotify.com/dashboard/) to obtain API credentials.

### Installation:

Installing project on local computer:

```bash
git clone https://github.com/ved-patel226/AlbumMagic.git
cd AlbumMagic
```

Filling Spotify Secrets:

```bash
cp .env.sample .env

```

Starting backend (rust):

```bash
cd backend
cargo run
```

Starting frontend (in different terminal):

```bash
cd ../frontend
npm run dev
```

Then, go to
**[http://localhost:5173/](http://localhost:5173/)** in your browser to view the app.

> **Note:** You'll have to authenticate with Spotify before you can start viewing your music!
