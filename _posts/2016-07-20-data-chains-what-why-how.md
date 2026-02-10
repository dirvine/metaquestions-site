---
layout: post
title: "Data chains: what? why? how?"
date: 2016-07-20
author: David Irvine
---
This blog post explains data chains as a decentralized data structure concept for the SAFE Network. Unlike blockchains that track transactions, data chains link together data identifiers (hashes, names, types) rather than the data itself, enabling validation that data belongs on a network.
## Key Concepts
- **Data chains** couple together data identifiers, not actual data
- Links are agreement blocks containing names and signatures of group members who agreed on the chain
- Each link must contain at least a majority of previous link members
- Data blocks (between links) represent data identifiers signed by majority of previous link
## Features Enabled by Data Chains
- Nodes can prove network existence and group membership
- Nodes can have provable history on the network
- Network can recover from massive churn or complete outage
- Support for open ledgers, versioning, and transaction receipts
- Nodes can vary in capabilities (storage, bandwidth)
- Reduced traffic during churn events
## Implementation Roadmap
1. Design completion for phase 1 (data security and persistence)
2. Open debates and discussions
3. Code development
4. Testing
5. Integration into existing system
6. End-to-end testing
7. Public use
