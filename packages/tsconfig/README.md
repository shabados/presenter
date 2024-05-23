# @presenter/tsconfig

Shared TypeScript config.

## Usage

`@presenter/tsconfig` should already be a dev dependency of the root workspace.

Add a `tsconfig.json` file to your individual workspace with the following contents:

```
{
  "extends": "@presenter/tsconfig",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```
