---
layout: post
title: "The language of the network"
date: 2015-02-05
author: David Irvine
---
David Irvine describes a breakthrough discovery in MaidSafe's network architecture - identifying four fundamental persona types that simplify the network's complexity and create a "language" to describe vault operations.
## Key Discovery: Four Authority Types
The network has only 4 persona types:
1. **Client Manager** - Group of routing nodes closest to a client node (e.g., MaidManager, MpidManager)
2. **Nae Manager** - Network Addressable Element manager groups for data/function elements (e.g., DataManagers, VersionManagers)
3. **Node Manager** - Group surrounding a node appearing in routing table (e.g., PmidManager)
4. **Managed Node** - Routing node in a group of Node Managers (e.g., PmidNode, future ComputeNode)
## Network Language
**Put operation:**
```
Client -> ClientManager <-> NaeManager -> NodeManager -> ManagedNode
```
**Get operation:**
```
Client <-> NaeManager <-> ManagedNode
```
## Impact
This discovery reduces vault code from 260+ complex template files to a handful of simple header files, enables faster development and testing of new features (safecoin, compute, AI, search), and moves toward formal proofs of the system.
