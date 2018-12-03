const bip39 = require("./bip39.min.js");
const bip32 = require("./bip32.js");
const bech32 = require("bech32");
const secp256k1 = require("./secp256k1.min.js");
import sha256 from "crypto-js/sha256";
import ripemd160 from "crypto-js/ripemd160";
import CryptoJS from "crypto-js";
import { NSCrypto } from "nativescript-crypto";
const crypto = new NSCrypto();

const hdPathAtom = "m/44'/118'/0'/0/0"; // key controlling ATOM allocation
const secp256k1PubkeyPrefix = "EB5AE98721";

export function generateWalletFromSeed(mnemonic) {
  try {
    const masterKey = deriveMasterKey(mnemonic);
    const { privateKey, publicKey } = deriveKeypair(masterKey);
    const cosmosAddress = createCosmosAddress(publicKey);
    return {
      privateKey: privateKey.toString("hex"),
      publicKey: publicKey.toString("hex"),
      cosmosAddress,
      mnemonic
    };
  } catch (err) {
    console.error(err);
    return {};
  }
}

export function generateWallet() {
  const randomBytes = Buffer.from(crypto.secureRandomBytes(32), "base64");
  console.log("randomBytes", randomBytes);
  if (randomBytes.length !== 32) throw Error("Entropy has incorrect length");

  const mnemonic = bip39.entropyToMnemonic(randomBytes.toString("hex"));
  if (mnemonic.split(" ").length !== 24)
    throw Error("Mnemonic needs to have a length of 24 words.");

  return generateWalletFromSeed(mnemonic);
}

/* vectors
pub 52FDFC072182654F163F5F0F9A621D729566C74D10037C4D7BBB0407D1E2C64981
acc cosmos1v3z3242hq7xrms35gu722v4nt8uux8nvug5gye
pub 855AD8681D0D86D1E91E00167939CB6694D2C422ACD208A0072939487F6999EB9D
acc cosmos1hrtz7umxfyzun8v2xcas0v45hj2uhp6sgdpac8
*/
export function createCosmosAddress(publicKey) {
  const hash = ripemd160(sha256(publicKey.toString("hex"))).toString();
  const address = Buffer.from(hash, "hex");
  const cosmosAddress = bech32ify(address, `cosmos`);

  if (cosmosAddress.length !== 45)
    throw Error("Cosmos address should have length 45");

  return cosmosAddress;
}
function deriveMasterKey(mnemonic) {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  var seed = bip39.mnemonicToSeed(mnemonic);
  var masterKey = bip32.fromSeed(seed);
  return masterKey;
}

function deriveKeypair(masterKey) {
  const cosmosHD = masterKey.derivePath(hdPathAtom);

  const privateKey = cosmosHD.privateKey;
  if (privateKey.length !== 32)
    throw Error("privateKey should have length 32 bytes");

  const publicKey = secp256k1.publicKeyCreate(privateKey, true);
  if (publicKey.length !== 33)
    throw Error("publicKey should have length 33 bytes");

  return {
    privateKey,
    publicKey
  };
}

function bech32ify(address, prefix) {
  if (address.length !== 20)
    throw Error("address should have a length of 20 bytes");

  let words = bech32.toWords(address);
  return bech32.encode(prefix, words);
}

export function sign(
  jsonObject,
  wallet,
  { sequence, account_number, chain_id }
) {
  // remove empty values
  Object.keys(jsonObject).forEach(key => {
    if (jsonObject[key] === null || jsonObject[key] === undefined) {
      delete jsonObject[key];
    }
  });

  // create StdSignMsg
  /*
  type StdSignMsg struct {
    ChainID       string      `json:"chain_id"`
    AccountNumber uint64      `json:"account_number"`
    Sequence      uint64      `json:"sequence"`
    Fee           auth.StdFee `json:"fee"`
    Msgs          []sdk.Msg   `json:"msgs"`
    Memo          string      `json:"memo"`
  }
  */
  const stdSignMsg = Object.assign({}, jsonObject, {
    sequence,
    account_number,
    chain_id
  });

  // order keys
  let orderedKeys = {};
  Object.keys(stdSignMsg)
    .sort()
    .forEach(function(key) {
      orderedKeys[key] = stdSignMsg[key];
    });

  let message = JSON.stringify(orderedKeys);
  const signBytes = Buffer.from(sha256(message).toString(), "hex");

  const { signature } = secp256k1.sign(
    signBytes,
    Buffer.from(wallet.privateKey, "hex")
  );
  // test created signature
  if (
    !secp256k1.verify(
      signBytes,
      signature,
      Buffer.from(wallet.publicKey, "hex")
    )
  )
    throw Error("Created signature couldn't be verified.");

  return {
    pub_key: {
      type: "tendermint/PubKeySecp256k1", // TODO allow other keytypes
      value: toBase64(wallet.publicKey)
    },
    signature: toBase64(signature.toString("hex")),
    account_number: account_number,
    sequence
  };
}

function toBase64(hexString) {
  var wordArray = CryptoJS.enc.Hex.parse(hexString);
  var base64Msg = CryptoJS.enc.Base64.stringify(wordArray);

  return base64Msg;
}
