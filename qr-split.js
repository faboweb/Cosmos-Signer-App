var QRCode = require("qrcode");

const LENGTH = 300;
function splitMessage(tx) {
  let message = JSON.stringify(tx);
  let parts = [];
  while (message.length > 0) {
    parts.push(message.substr(0, LENGTH));
    message = message.substr(LENGTH);
  }
  return parts;
}

let exampleMessage = {
  consumer: "cosmos-signer",
  endpoint: "https://10.0.2.2:9070/tx/broadcast",
  address:
    "cosmos1vcurycmpx33rgd3exfskgdt9v43kydn9vcurgef4xyunqe35xqcngvesxgergvfnzdz2z6",
  requestMetaData: {
    sequence: "0",
    account_number: "1",
    chain_id: "local-testnet"
  },
  tx: {
    fee: { amount: [{ amount: "0", denom: "" }], gas: "200000" },
    memo: "",
    msg: [
      {
        type: "cosmos-sdk/Send",
        value: {
          inputs: [
            {
              address:
                "cosmos1vcurycmpx33rgd3exfskgdt9v43kydn9vcurgef4xyunqe35xqcngvesxgergvfnzdz2z6",
              coins: [{ amount: "10", denom: "localcoin" }]
            }
          ],
          outputs: [
            {
              address: "cosmos1ehev36xzn994a5kc5leak83ztz2n97n99nekug",
              coins: [{ amount: "10", denom: "localcoin" }]
            }
          ]
        }
      }
    ],
    signatures: null
  }
};
function createMessages(message) {
  let parts = splitMessage(message);
  if (parts.length === 1) {
    return [
      {
        type: "single",
        payload: JSON.stringify(message)
      }
    ];
  }
  return parts.map((part, index) => {
    if (index === 0) {
      // keep meta data
      return {
        type: "multi",
        parts: parts.length,
        part: index,
        payload: part
      };
    }
    return {
      type: "multi",
      parts: parts.length,
      part: index,
      payload: part
    };
  });
}

async function createQRCodes(messages) {
  messages.forEach(async (message, index) => {
    // works also with toImageURL for the browser
    await QRCode.toFile("./qr-" + index + ".png", JSON.stringify(message), {
      type: "png"
    });
    // let svg = await QRCode.toString(JSON.stringify(message), {
    //   type: "svg"
    // });
    // console.log(svg);
  });
}

let messages = createMessages(exampleMessage);
console.log(messages);
createQRCodes(messages);
