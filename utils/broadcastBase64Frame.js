const { Server } = require("ws");
const wss = new Server({ port: 8080 });

let base64StreamingClients = [];

wss.on("connection", (ws) => {
    base64StreamingClients.push(ws);

    ws.on("close", () => {
        base64StreamingClients = base64StreamingClients.filter((client) => client !== ws);
    });
});

exports.broadcastBase64Frame = (base64Data) => {
    base64StreamingClients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(base64Data);
        }
    });
};
