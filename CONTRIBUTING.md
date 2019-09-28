# Contributing Guildeines

We're glad you're interesting in contributing!

## Style

This repository follows the **Airbnb's Javascript Style Guide**, with a few minor modifications. Notably, spaces should be included inside parentheses and brackets (weird, right!).

An ESLint file is provided,
and your code will automatically be checked on-commit for style.
It is recommended to install an ESLint plugin for your editor (VS Code's `ESLint` plugin works out of the box), so you can receive linter suggestions as you type.

Create one feature per branch, preferably working against an issue. PRs will be squashed and merged when complete.

## Commit Message Guidelines

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
````

The header is mandatory and the scope of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

The footer should contain a closing reference to an issue if any, such as `Closes #21`.

Examples:
```
docs(readme): add contributing guidelines
```
```
fix(backend): synchronise state with frontend

The backend would not send all required data to the frontend.

Fixes #53
```

### Revert
If the commit reverts a previous commit, it should begin with `revert:` , followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- *build*: Changes that affect the build system or external dependencies (example scopes:  -gulp, broccoli, npm)
- *ci*: Changes to our CI configuration files and scripts (example scopes: Circle,  -BrowserStack, SauceLabs)
- *docs*: Documentation only changes
- *feat*: A new feature
- *fix*: A bug fix
- *perf*: A code change that improves performance
- *refactor*: A code change that neither fixes a bug nor adds a feature
- *style*: Changes that do not affect the meaning of the code (white-space, formatting,  -missing semi-colons, etc)
- *test*: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:

backend
frontend
frontend/controller
frontend/overlay
frontend/presenter
frontend/settings
frontend/themes

There are currently a few exceptions to the "use package name" rule:

- *packaging*: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
- *changelog*: used for updating the release notes in CHANGELOG.md
- *none/empty string*: useful for `style`, `test`, and `refactor` changes that are done across all packages (e.g. style: add missing semicolons) and for docs changes that are not related to a specific package (e.g. docs: fix typo in tutorial).

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit Closes.

Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.