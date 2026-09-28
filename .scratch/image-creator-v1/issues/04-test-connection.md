# 04: Test connection

**What to build:** In the settings view the user presses Test connection and learns whether the entered base URL and API key work, without spending money on a Generation. Failures show the API's message, so a wrong URL can be told apart from a wrong key.

**Blocked by:** 02 Provider settings.

**Status:** ready-for-agent

- [ ] Test connection calls the models endpoint under the entered base URL with the entered (or stored) API key, without requiring Save first.
- [ ] Success and failure are shown in the settings view; failures include the API's message or the network error.
- [ ] End-to-end tests cover success, an authentication error and an unreachable URL, using the fake server's models endpoint.

## Steps

1. Add Test connection with the models endpoint in the fake server and end-to-end tests.
