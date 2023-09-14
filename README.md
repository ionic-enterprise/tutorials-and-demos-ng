# Tutorials and Demos for Angular

This is a collection of tutorials and demos.

## Packages

### Auth Connect

Under construction.

### Identity Vault

Under construction.

### Demos

Under construction.

## Building

In order to install and build from this repo, you will need:

- [pnpm](https://pnpm.io/)
- Access to [Auth Connect](https://ionic.io/docs/auth-connect), [Identity Vault](https://ionic.io/docs/identity-vault), and [Secure Storage](https://ionic.io/docs/secure-storage).

If you do not have access to all three products, you can still install and build any given tutorial or demo by copying it to its own directory somewhere.

To build:

- Clone the repo and change directory into it.
- Copy the `.npmrc` file that contains your Ionic Enterprise key (see our [registration docs](https://ionic.io/docs/enterprise-starter/enterprise-key) for details).
- `pnpm install`
- `pnpm build`

To run any given project using the development server, use `pnpm --filter [project] start`. For example: `pnpm --filter ./auth-connect/getting-started start`
