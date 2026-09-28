# Speak only the OpenAI-compatible Images protocol

Image-generation APIs differ in request and response shape, so a "configurable API" could mean per-provider adapters or a user-defined request template. We support only the OpenAI-compatible Images protocol, with a configurable base URL, API key and model, because it already covers OpenAI, Azure OpenAI and most gateways without the user having to understand request formats. Generation goes through a small provider interface, so other protocols can be added as further implementations later without reshaping the app.

## Considered Options

- **Per-provider adapters (Stability, Imagen, Replicate, ...)**: more reach, but several integrations to build and maintain up front.
- **User-defined request template and response path**: maximally flexible, but hard to configure and easy to get wrong.
