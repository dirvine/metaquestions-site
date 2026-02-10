---
layout: post
title: "Proof Of Storage (maidsafe part II)"
date: 2014-08-17
author: David Irvine
categories:
  - complex systems
  - MaidSafe
  - Uncategorized
---
This blog post explains the concept of Proof of Storage as part of MaidSafe's Proof of Resource mechanism. The author breaks down what hashes are, explains secure hashes, and describes the Integrity Check process used to verify data storage without transferring the actual data.

## Key Concepts

**Proof of Storage vs Proof of Resource:** Proof of storage is only one part of the larger proof of resource system.

**What is a Hash:** A fixed-length digital fingerprint of data (e.g., SHA256 = 256 bits, SHA512 = 512 bits). Hashes are irreversible - you cannot recover the original data from a hash.

**Secure Hash:** The security refers to collision resistance - the more secure the algorithm, the less chance two pieces of data share the same fingerprint. Small changes to data produce wildly different hash results.

## Integrity Check Process

1. A checking group (Data Managers) creates a random string
2. The random string is sent encrypted to all data holders
3. Data holders append the string to original data and hash the result
4. Results are collected and compared at the checking group
5. Nodes returning different results are considered compromised and de-ranked

This uses a mechanism similar to zero-knowledge proof - verifying data is held correctly without needing to know or transfer the content.
