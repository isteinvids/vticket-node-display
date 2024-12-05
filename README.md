# vTicket EPOS

## Installing

After CDing to working directory:

- `npm install` - Installs the node.js modules we need
- `npm run build` - Builds the Typescript to JS
- `node bin/start.js` - Starts Socket.IO server

## Usage

The code will loop through the available COM ports on the PC to find which ports the hardware is on.  This is by matching the hardware VendorID from values in the .env file.

The client may also provide a COM port which the NodeJS server will attempt to use.

<!-- TODO: document this a bit better -->

A Socket.IO server is hosted on port 3000. Communicating with the hardware is done by emitting certain events to the socket:

Event name | Args | Description
--- | --- | ---
`display/text` | `{ 'one': string, 'two': string }` | Show text on display
`display/clear` | None | Clear display

Display text example:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
<script>
  const socket = io('http://localhost:3000/');
  socket.on('connect', function() {
    console.log("connected to node server");
  });
  socket.on('disconnect', function() {
    console.log("disconnected from node server");
  });
  socket.on('hardware/error', (err) => {
    alert((err && err.errorMessage) || '???');
  });
  socket.on('display/text', () => {
    console.log('show text done');
  });
  socket.emit('display/text', {
    one: 'line one',
    two: 'line two'
  });
</script>
```

See `public/index.html` for more examples (including printing & cash drawer examples)

When running `node bin/start.js`, the public directory is hosted on localhost:3000. This is convenient for testing the client-side code!
