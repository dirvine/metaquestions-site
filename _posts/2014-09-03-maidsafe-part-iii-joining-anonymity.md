---
layout: post
title: "MaidSafe part III - Joining & anonymity"
date: 2014-09-03
author: David Irvine
categories:
  - complex systems
  - MaidSafe
---
This post explains how MaidSafe's network handles node joining and maintains anonymity, contrasting it with Tor/i2p approaches. The key difference is that IP addresses don't traverse the network in MaidSafe.

## Network Architecture

- Uses a secured DHT implementation based on XOR networking
- Two node types: Clients (passive data producers/consumers) and Vaults (routing infrastructure)
- Both use unique 512-bit private IDs unlinked to public identities

## Connection Process

- Nodes read from cached lists or fall back to hardcoded bootstrap nodes
- Bootstrap nodes have IP:PORT and public keys
- 100% encrypted communications from the first message

## Anonymity Mechanism

- Clients connect to close nodes, requests are relayed with IP:PORT stripped
- Data returns to anonymous ID through network hops
- No IP:PORT notion in messages unless XOR-close to the node
- Vault IDs are randomly assigned by the network, not chosen by users
- Targeted attacks require millions of computers running correctly to potentially get close to a single node

## Security Features

- All messages encrypted
- Router compromise is irrelevant due to encryption
- In-transit encryption and end-to-end identification at every hop
