---
layout: post
title: "Shortest distance between two points is not always a straight line"
date: 2014-08-01
author: David Irvine
---
This blog post explains XOR-based networking concepts used in MaidSafe, contrasting them with traditional linear/Euclidean thinking. The author explains how XOR distance metrics work differently from conventional number systems, creating unique properties useful for decentralized networks.
## XOR Distance Properties
- Distance is not based on normal number systems (e.g., distance from 4→3 is 7, but 2→3 is 1)
- Each node has unique distances from every other node
- No straight line distance between nodes (like points on a sphere)
- Every node sees a different network perspective
## Closeness in MaidSafe
- Closeness is uni-directional/asymmetric
- Distance is bi-directional/symmetric
- Close groups vary depending on the data element being considered
## Network Architecture
- Address space is 2^512 (larger than atoms in visible universe)
- Network of networks concept with multiple typed data layers
- Nodes connect to 16 closest nodes plus random connections for logarithmic search
- Continuous network reconfiguration provides security through node churn
## Security Features
- Data has different protectors with each churn event
- Moving target makes attacks difficult
- Self-authentication without intermediaries
