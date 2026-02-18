# Cloudflare Infrastructure & Edge Security Implementation

This repository contains the technical implementation for securing a GCP-hosted origin using Cloudflare Zero Trust and Edge Workers.

## Implementations
### 1. Origin Web Server - Configured with Cloudflare Tunnels
**URL** - https://tunnel.samriddhijaiswal.com/headers
- The application is reachable at the above URL. Upon any HTTP request, the response body returns all incoming HTTP request headers as a structured payload.
- Established an outbound-only connection from a GCP VM to Cloudflare using `cloudflared`, removing the need for public inbound ports.

### 2. Cloudflare Workers (Edge Logic)
The `cf-workers-logic.js` file contains an revised script deployed to the Cloudflare Edge. 
- **Functionality:** It intercepts incoming requests, logs headers, and enforces a 302 redirect for specific User-Agents (e.g., blocking `curl` requests). The logic for a bypass based on special cookie+value pair has been included. 

### 3. DNS Configuration
The `dns-audit-redacted.json` file provides an audit trail of the DNS records configured during this task. 
- **Note:** Account IDs have been redacted for security purposes.

### 4. Zero Trust and Access Policies 
**URL** - tunnel.samriddhijaiswal.com/secure
- Path Lockdown: The `/secure` directory was isolated using Cloudflare Access.
- Policy only allows the following ID to authenticate - vvishal@cloudflare.com
    - The 404 response received post-authentication is an expected behavior of the origin server (which lacks a `/secure` directory) 


## How to Validate

### Cloudflare Worker — Access
- **Worker URL** - https://cf-worker-redir-logic.samriddhijaiswal75.workers.dev/
    - Worker was deployed using the native Cloudflare Dashboard environment

#### For the redirect 
`curl -I https://cf-worker-redir-logic.samriddhijaiswal75.workers.dev/`
  - Expected result: HTTP/2 302 with location pointing to redirect link

#### The Bypass 
`curl -I - -cookie “cf-noredir=true” https://cf-worker-redir-logic.samriddhijaiswal75.workers.dev/`
  - Expected result: HTTP/2, proving successfully bypassed the redirect.
