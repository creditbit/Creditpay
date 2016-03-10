##Creditbit
-----------
[![Build Status](https://secure.travis-ci.org/bitpay/copay.svg)](http://travis-ci.org/bitpay/copay) 
[![Coverage Status](https://img.shields.io/coveralls/bitpay/copay.svg)](https://coveralls.io/r/bitpay/copay?branch=master) 
[![Stories in Ready](https://badge.waffle.io/bitpay/copay.svg?label=in progress&title=In progress)](https://waffle.io/bitpay/copay)

*Creditbit* is an easy-to-use, open-source, multiplatform, multisignature, secure bitcoin wallet platform for both  individuals and companies. 

*Creditbit* uses Creditbitcore-Wallet-Service (https://github.com/creditbit/creditbitcore-wallet-service) for peer synchronization and bitcore network interfacing. 

## Before you start

Current Creditbit version is meant to be run on *mobile devices OR desktop application*, NOT browsers.

When running Creditbit as a web page, and a browser extension is enabled, the browser extension
could have access to Creditbit internal data, and compromise the user's private key
and more.

## Installation

```sh
git clone https://github.com/creditbit/Creditbit.git
cd Creditbit
```

Install [bower](http://bower.io/) and [grunt](http://gruntjs.com/getting-started) if you haven't already:

```sh
npm install -g bower
npm install -g grunt-cli
```

Build *Creditbit*:

```sh
bower install
npm install
grunt
```

For production environments:

```sh
grunt prod
```

Open *Creditbit*:

```sh
npm start
```

Then visit localhost:3000 in your browser.

## Bitcore Wallet Service

Creditbit depends on  creditbitcore Wallet Service (CWS) for blockchain information, networking and Creditbiter synchronization. CWS can be run within minutes or you can use a public instance. Switch between CWS instances is very simple and can be done with a click from Creditbit.


## Tests

Open test/index.html in your browser to test models. Install [mocha](https://www.npmjs.com/package/mocha) and [karma](https://www.npmjs.com/package/karma-cli) to test the services and controllers.

```sh
npm install mocha
npm install karma-cli
```

Run all tests:

```sh
mocha
karma start
```

## Troubleshooting

### Building on Ubuntu 14.04, gyp, Python

If you are using Ubuntu and encounter this error (or one similar):

```sh
gyp_main.py: error: no such option: --no-parallel
gyp ERR! configure error 
gyp ERR! stack Error: `gyp` failed with exit code: 2
```

This is because Ubuntu 14.04 and 14.10 have Python 2.7 installed by default but **gyp** requires Python 2.6. See: (http://stackoverflow.com/questions/21155922/error-installing-node-gyp-on-ubuntu)

One solution to this issue is to use *Creditbit* with a Python version manager and install 2.6.  For example, if you have pyenv installed:

```sh
pyenv install 2.6.9
pyenv global 2.6.9
```
# Desktop versions (Windows, OSX, Linux)

Creditbit uses NW.js (also know as node-webkit) for its desktop version. NW.js an app runtime based on `Chromium` and `node.js`. 

## Building Creditbit for OSX, Linux and Windows versions

**Requirements**

  - Install NW.js in your system from [nw.js](http://nwjs.io/)

**Builder**

  - Run `grunt desktop` (*)
  
  
# Development

## Google Chrome App

To build *Creditbit*'s Chrome App, run:

```sh
npm run-script chrome
```

On success, the chrome extension will be located at: `browser-extensions/chrome/Creditbit-chrome-extension`

To install it go to `chrome://extensions/` in your Chrome browser and ensure you have the 'developer mode' option enabled in the settings.  Then click on "Load unpacked chrome extension" and choose the directory mentioned above.

## Firefox Add-on
The *Creditbit* Firefox Extension has been deprecated and is no longer supported.

## Translations
*Creditbit* uses standart gettext PO files for tranlations. It is currently translated to spanish, japanese, french, german and portuguese thank to community contributions. See https://github.com/bitpay/copay/pull/2880 as an example pull request for adding translations.

Translation Credits: Japanese: @dabura667, French: @kirvx, Portuguese: @pmichelazzo, Spanish: @cmgustavo, German: @saschad. Gracias totales!


# QA and Bug Reporting

In the interest of improving bug reporting, for each bug that you find and want to create a ticket about, please refer to a form that contains:
* A brief description of the bug
* Steps required to reproduce it
* The platform in which you are testing
* Any screenshots, if possible
* The expected behaviour

For example, a really useful bug report should look like:

```
Problem: The application fails at login.

To reproduce:
1. Launch the app with `npm run start`
2. Click on "Join a Wallet"
3. Type an nonexistent username
4. The app stops working and throws an "Unhandled exception" error.

Expected: The app should login to the home screen after clicking login and show no errors.

Platform: Android 4.3, Android 4.4, iOS
```

# About *Creditbit*

## General

*Creditbit* implements a multisig wallet using [p2sh](https://en.bitcoin.it/wiki/Pay_to_script_hash) addresses. It supports multiple wallet, with with its own configuration, such as 3-of-5 (3 required signatures from 5 participant peers) or 2-of-3.  To create a multisig wallet shared between multiple participants, *Creditbit* requires the extended public keys of all the wallet participants.  Those public keys are then incorporated into the wallet configuration and combined to generate a payment address where funds can be sent into the wallet.  Conversely, each participant manages their own private key and that private key is never transmitted anywhere.

To unlock a payment and spend the wallet's funds, a quorum of participant signatures must be collected and assembled in the transaction.  The funds cannot be spent without at least the minimum number of signatures required by the wallet configuration (2 of 3, 3 of 5, 6 of 6, etc).  Once a transaction proposal is created, the proposal is distributed among the wallet participants for each to sign the transaction locally.  Once the transaction is signed, the last signing participant will broadcast the transaction to the Bitcoin network.

*Creditbit* also implements [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) to generate new addresses for peers.  The public key that each participant contributes to the wallet is a BIP32 extended public key.  As additional public keys are needed for wallet operations (to produce new addresses to receive payments into the wallet, for example) new public keys can be derived from the participants' original extended public keys.  Once again, it's important to stress that each participant keeps their own private keys locally - private keys are not shared - and are used to sign transaction proposals to make payments from the shared wallet.

For more information regarding how addresses are generated using this procedure, see: [Structure for Deterministic P2SH Multisignature Wallets](https://github.com/maraoz/bips/blob/master/bip-NNNN.mediawiki).

## Bitcore

Creditbit uses the powerful and feature-rich [Creditbitbitcore](https://github.com/creditbit/creditbitcore-lib) Javascript library for Bitcoin-related functions.  creditbitcore should be built this way:

## Payment Protocol

Creditbit currently supports [BIP70 (Payment Protocol)](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki), with the following limitations:
* Only one output is allowed.  Payment requests that are more that one output are not supported.
* Only standard Pay-to-pubkeyhash and Pay-to-scripthash scripts are supported (on payment requests).  Other script types will cause the entire payment request to be rejected.
* Memos from the customer to the server are not supported (i.e. there is no place to write messages to the server in the current UX)
 



