const bip39 = require("./bip39.min.js");
const bip32 = require("./bip32.js");
const bech32 = require("bech32");
const secp256k1 = require("secp256k1");
import sha256 from "crypto-js/sha256";
import ripemd160 from "crypto-js/ripemd160";
import { NSCrypto } from "nativescript-crypto";
const crypto = new NSCrypto();
// var dialogs = require("tns-core-modules/ui/dialogs");

const hdPathAtom = "m/44'/118'/0'/0/0"; // key controlling ATOM allocation
const secp256k1PubkeyPrefix = "EB5AE98721";

export async function generateWallet() {
  try {
    const randomString = crypto.secureRandomBytes(32);
    const randomHexString = new Buffer(randomString)
      .toString("hex")
      .substr(0, 32);
    // const randomHexString = "00000000000000000000000000000000";
    const mnemonic = bip39.entropyToMnemonic(randomHexString);
    //   const seed = bip39.mnemonicToSeed(mnemonic);
    //   const root = bip32.fromSeed(seed);
    const masterKey = deriveMasterKey(mnemonic);
    const cosmosHD = masterKey.derivePath(hdPathAtom);
    console.log("hdNode", cosmosHD);

    // NOTE: we want to make sure private keys are always 32 bytes
    // else we may have trouble. See the bitcore fiasco for more:
    // https://github.com/bitpay/bitcore-lib/issues/47
    // https://github.com/bitpay/bitcore-lib/pull/97
    console.log("privateKeyWif ", cosmosHD.toWIF());
    const privateKey = Buffer.from(cosmosHD.privateKey);
    console.log("privateKey", privateKey.toString("utf8"));
    // bitcoin and cosmos use compressed pubkey of 33 bytes.
    const publicKey = secp256k1.publicKeyCreate(cosmosHD.privateKey, true);
    console.log("publicKey", publicKey.toString("hex"));
    // const prefixedPubKey = secp256k1PubkeyPrefix + publicKey.toString("hex");
    // console.log("prefixedPubKey", prefixedPubKey);
    console.log("sha256", sha256(publicKey).toString());
    console.log(
      "ripemd160 + sha256",
      ripemd160(sha256(publicKey).toString()).toString()
    );
    const address = Buffer.from(ripemd160(sha256(publicKey)).toString());
    console.log("address", address);

    const cosmosAddress = bech32ify(address, `cosmos`);

    // await dialogs.alert({ privateKey, publicKey, cosmosAddress });

    console.error({
      privateKey: privateKey.toString("hex"),
      publicKey: publicKey.toString("hex"),
      cosmosAddress
    });
    return {
      privateKey: privateKey.toString("hex"),
      publicKey: publicKey.toString("hex"),
      cosmosAddress
    };
  } catch (err) {
    console.error(err.stack);
    return {};
  }
}

function deriveMasterKey(mnemonic) {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  var seed = bip39.mnemonicToSeed(mnemonic);
  var masterKey = bip32.fromSeed(seed);
  return masterKey;
}

function bech32ify(address, prefix) {
  let words = bech32.toWords(address);
  return bech32.encode(prefix, words);
}
