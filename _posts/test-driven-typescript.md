![TypeScript logo](/assets/typescript.webp)
<!-- .element: style="margin: 1rem auto; max-width: 12rem" -->

# Test-driven TypeScript

### Narrative

Hello again!

Recently, I started working on a new project and wanted to combine a set of tools and technologies that I believed would work seamlessly together. Here's what I had in mind:

First, I wanted to adopt test-driven development (TDD) as it would serve as a guide for my design, help me stay focused on my tasks, and ensure the system's behavior was safe to refactor.

Second, TypeScript offers excellent tooling support, optional contracts to enforce design decisions while coding, and useful language features such as strict null checking.

Finally, I planned to utilize ECMAScript modules, also known as ES modules. These modules would allow me to run my code using popular engines like Node.js or Deno. Alternatively, I could execute my module and all its dependencies directly within a browser environment.

However, setting up this combination of tools and technologies turned out to be more challenging than expected. To assist others facing a similar situation, I decided to share both the final outcome of my work and the step-by-step process of achieving it using test-driven development.

If you're eager to start writing tests using TypeScript and ECMAScript modules right away, I've included a link to the template repository I created below. On the other hand, if you're interested in understanding how to tackle a problem like this using TDD, I encourage you to continue watching!

---

## Starting with a test…

`test.ts`
```ts [1-8|1|2|4-8|5-7|6]
import assert from "assert"
import { generateTruth } from "./generate-truth"

describe("generateTruth", () => {
  it("should return true", () => {
    assert.equal(generateTruth(), true)
  })
})
```

### Narrative

In `test.ts`, we have a simple test written using TypeScript and ES modules. Let's go through each line to understand our expectations and how this test ensures that our repository meets them.

+

The first line imports an assertion library. Specifically, we are utilizing a library called [assert](https://www.npmjs.com/package/assert). This NPM module aims to mimic the functionality of the Node.js assert API while being compatible with browser environments.

It's also important to note that we're using the [ES Module default import syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#default_import), which we will explore in more detail later.

+

Moving on, the subsequent line deals with importing the code under test. We employ an [ES Module named import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import) to load this file.

+

Next, we encounter a "describe" block, which is utilized in [Behaviour-driven development](https://dannorth.net/introducing-bdd/) or BDD. BDD is one of the various [testing interfaces](https://mochajs.org/#interfaces) available for writing tests. Describe is used to mark out an important component of a system—in our case it's the `generateTruth` function— and any specifications that follow are assumed to be under the context of the component we have described.

+

Following the "describe" block, we encounter the "it" block. The "it" block is used to specify an expectation. In our test, we are stating that we expect the `generateTruth` function to return true.

It's worth mentioning that the BDD interface promotes readable tests, and the test we've defined here can be read as "generateTruth should return true" by combining the titles of the "describe" and "it" blocks. BDD test reporters often present test names in this manner to enhance comprehension.

+

Finally, we utilize the assertion library to ensure the return value from the `generateTruth` function is `true`.

---

## …and a way to run the test

```sh [1-9|1|3-9|7]
> npm test
npm test
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path ~/template-typescript/package.json
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory, open '~/template-typescript/package.json'
npm ERR! enoent This is related to npm not being able to find a file.
npm ERR! enoent
```

### Narrative

To get started, all we need is our test file and the expectation that running the command npm test will eventually lead to a passing test.

I have skipped a few steps by assuming the installation of Node.js and NPM, so if you haven't already installed them, please visit this link and install them.

Before we begin, it's worth taking a moment to talk about the test-driven development process.

With TDD, we start with just a test and an expectation that, when run with our testing tool of choice, it will eventually pass. From this point onwards, all our work will involve taking small steps guided by feedback we get from our computer, progressively moving closer to our goal.

A wonderful quote that encapsulates the TDD process came from an engineering YouTube channel called [Stuff Made Here](https://www.youtube.com/@StuffMadeHere). After many attempts to resolve a bug in one of his machines and finally fixing it, the host mentioned that he, "ran out of ways to do it wrong." To me, this beautifully summarizes the ethos of test-driven development and perhaps engineering as a whole.

Now, let's get back to our project!

Running `npm test`:

+

produces the following result:

+

Based on the error message:

+

it is evident that there is no `package.json` file available for NPM to inspect and understand how we intend to execute our tests. Therefore, let's add a package.json file to address this issue.

---

## Add package.json

`package.json`
```json
```

```sh [1-6|1|4]
> npm test
npm ERR! code EJSONPARSE
npm ERR! path ~/template-typescript/package.json
npm ERR! JSON.parse Unexpected end of JSON input while parsing empty string
npm ERR! JSON.parse Failed to parse JSON data.
npm ERR! JSON.parse Note: package.json must be actual JSON, not just JavaScript.
```

### Narrative

After adding a blank `package.json` file and running npm test, we encounter a new error.

+

The error message informs us that Node expects the package.json file to contain valid JSON data, and an empty file does not meet this requirement.

---

## Add JSON to package.json

`package.json`
```json []
{}
```

```sh [1-5|1|2]
> npm test
npm ERR! Missing script: "test"
npm ERR! 
npm ERR! To see a list of scripts, run:
npm ERR!   npm run
```

### Narrative

By adding an empty JSON object to `package.json`, file, we have enough structure to run `npm test`.

+ +

NPM is now telling us that we are trying to run the test script, which has not been defined. Let's define it!

---

## Add test script to package.json

`package.json`
```json [1-5|2-4|3]
{
  "scripts": {
    "test": "mocha"
  }
}
```

```sh [1-6|1|6]
> npm test

> test
> mocha

sh: mocha: command not found
```

### Narrative

After adding a `scripts` property to `package.json`:

+

and opting to use `mocha`, a popular and simple Javascript testing library for our project:

+

we proceed to run `npm test`:

+

The script now runs, but NPM tells us it cannot find the mocha executable. We need to install it as a development dependency, which we will do now.

---

## Add mocha as a dev dependency

`package.json`
```json [1-8|5-7|6]
{
    "scripts": {
        "test": "mocha"
    },
    "devDependencies": {
        "mocha": "^10.2.0"
    }
}
```

```sh [1-8|1|3]
> npm install

added 78 packages, and audited 79 packages in 2s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```sh[1-6|1|6]
> npm test

> test
> mocha

Error: No test files found: "test"
```

### Narrative

By adding `mocha` to the `devDependencies` property in our `package.json` file, we ensure that it is available for use in our project.

+ +

However, we still need to install `mocha` and it's dependencies on our local machine by running `npm install`.

+

Once the installation is complete:

+

we are now ready to run our tests again.

+ 

However, when we run mocha, it doesn't find any tests to run. By default, mocha is not aware of TypeScript files. To address this issue, we need to instruct mocha to explicitly include our TypeScript test file.

---

## Specify test file to use

`package.json`
```json [1-8|3]
{
    "scripts": {
        "test": "mocha test.ts"
    },
    "devDependencies": {
        "mocha": "^10.2.0"
    }
}
```

```sh [1-16|1|6|8]
npm test

> test
> mocha

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for ~/template-typescript/test.ts
    at new NodeError (node:internal/errors:399:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
    at new ModuleJob (node:internal/modules/esm/module_job:64:26)
    at #createModuleJob (node:internal/modules/esm/loader:480:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34)
```

### Narrative

After adding `test.ts` as the spec argument to the `mocha` CLI in our test script:

+

we can try to run `mocha` again from our test script.

+ +

`mocha` now reads the file, but Node.js does not know how to process it when `mocha` attempts to load it.

+

There's a file named `get_format` that we will review later, but for now it's safe to assume we need to give Node.js some help to get started with TypeScript.

---

## Add ts-node to JIT-transpile TypeScript

`package.json`
```json [1-9|7]
{
    "scripts": {
        "test": "mocha --require 'ts-node/register' test.ts"
    },
    "devDependencies": {
        "mocha": "^10.2.0",
        "ts-node": "^10.9.1"
    }
}
```

```sh [1-8|1|3]
> npm install

added 19 packages, and audited 98 packages in 3s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```sh [1-34|1|6|7-10|7|9-10|11-18|11,15|20-34|7]
> npm test

> test
> mocha --require 'ts-node/register' test.ts

TSError: ⨯ Unable to compile TypeScript:
test.ts:2:31 - error TS2307: Cannot find module './generate-truth.js' or its corresponding type declarations.

2 import { generateTruth } from "./generate-truth.js";
                                ~~~~~~~~~~~~~~~~~~~~~
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at Module.m._compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1617:30)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Function.Module._load (node:internal/modules/cjs/loader:958:12)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.exports.requireOrImport (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:53:16)
    at async Object.exports.loadFilesAsync (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:100:20)
    at async singleRun (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async Object.exports.handler (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run.js:370:5)
```

### Narrative

To use TypeScript in our project, we will add a new dependency called `ts-node`.

+ + +

`ts-node` is a just-in-time TypeScript-to-JavaScript transpiler. It allows us to pass TypeScript files to tools like `mocha`, which expect JavaScript, and `ts-node` will convert those files to their JavaScript equivalent before mocha processes them. By hooking into Node's require lifecycle, `ts-node` ensures that whenever a TypeScript file is requested, a functionally-equivalent JavaScript file is returned.

This works by hooking `ts-node` into Node.js' require lifecycle, ensuring that whenever a TypeScript file is requested, a JavaScript file that is functionally equivalent is returned instead.

|

After adding ts-node, we run our test and encounter several errors related to TypeScript compilation.

+ +

We can take a look at the first error briefly to discuss the error format.

+

The error format consists of a description line followed by the context in the affected file where the error occurs. 

+ +

The last two errors indicate that the describe and it functions cannot be found.

+ +

And while we won't use it for now, the stack trace is presented after the error list which can guide us towards the source of the errors if we need further context.

+

Upon reviewing the errors, we notice that the first error is related to the generate-truth.js file not being found.

+

Recalling our understanding of how `ts-node` works, we can infer that the JavaScript extension is expected due to the transpiled test code trying to import it.

To resolve this missing module error, let's add a TypeScript version of the file so that it can be transpiled correctly and imported as expected.

---

## Add generate-truth.ts

`generate-truth.ts`
```ts
```

```sh [1-34|1|7-10|7]
npm test

> test
> mocha --require 'ts-node/register' test.ts

TSError: ⨯ Unable to compile TypeScript:
test.ts:2:10 - error TS2305: Module '"./generate-truth.js"' has no exported member 'generateTruth'.

2 import { generateTruth } from "./generate-truth.js";
           ~~~~~~~~~~~~~
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at Module.m._compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1617:30)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Function.Module._load (node:internal/modules/cjs/loader:958:12)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.exports.requireOrImport (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:53:16)
    at async Object.exports.loadFilesAsync (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:100:20)
    at async singleRun (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async Object.exports.handler (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run.js:370:5)
```

### Narrative

After adding an empty `generate-truth.ts` file we can see the module is found and loaded successfully, but it does not export the expected `generateTruth` member.

+ + +

To fix this issue, we need to export the `generateTruth` member from the `generate-truth.ts` file.

---

## Add generateTruth export

`generate-truth.ts`
```ts
export const generateTruth = undefined;
```

```sh [1-35|1|16-19|16]
npm test

> test
> mocha --require 'ts-node/register' test.ts


TSError: ⨯ Unable to compile TypeScript:
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~
test.ts:6:22 - error TS2722: Cannot invoke an object which is possibly 'undefined'.

6         assert.equal(generateTruth(), true);
                       ~~~~~~~~~~~~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at Module.m._compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1617:30)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Function.Module._load (node:internal/modules/cjs/loader:958:12)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.exports.requireOrImport (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:53:16)
    at async Object.exports.loadFilesAsync (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:100:20)
    at async singleRun (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async Object.exports.handler (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run.js:370:5)
```

### Narrative

Exporting an `undefined` member from `generate-truth.ts` is another step forward, but it leads to a new error during testing. 

+ + +

This error indicates that TypeScript cannot invoke something that may be undefined, which is the case in our situation.

To resolve this error, we need to add a proper definition and implementation to our exported `generateTruth` member in the `generate-truth.ts` file.

---

## Make generateTruth a function

`generate-truth.ts`
```ts
export const generateTruth = () => {};
```

```sh [1-31|1|8-15]
> npm test

> test
> mocha --require 'ts-node/register' test.ts


TSError: ⨯ Unable to compile TypeScript:
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at Module.m._compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1617:30)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Function.Module._load (node:internal/modules/cjs/loader:958:12)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.exports.requireOrImport (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:53:16)
    at async Object.exports.loadFilesAsync (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:100:20)
    at async singleRun (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async Object.exports.handler (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run.js:370:5)
```

### Narrative

Exporting a function from the generate-truth.ts file allows us to make progress in our testing.

+ +

However, we are now confronted with missing name errors, indicating that Node.js cannot load these `mocha` variables correctly. Node suggests adding the `@types/mocha` package to resolve the issue.

Let's proceed with installing the `@types/mocha` package and see if it helps address the error.

---

## Install types for mocha

`package.json`
```json [1-10|6]
{
    "scripts": {
        "test": "mocha --require 'ts-node/register' test.ts"
    },
    "devDependencies": {
        "@types/mocha": "10.0.1",
        "mocha": "^10.2.0",
        "ts-node": "^10.9.1"
    }
}
```

```sh [1-8|1|3]
> npm install

added 1 package, and audited 99 packages in 371ms

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```sh [1-30|1|7-14|16-20|21|21,23-26]
> npm test

> test
> mocha --require 'ts-node/register' test.ts

TSError: ⨯ Unable to compile TypeScript:
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at Module.m._compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1617:30)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Function.Module._load (node:internal/modules/cjs/loader:958:12)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.exports.requireOrImport (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:53:16)
    at async Object.exports.loadFilesAsync (/Users/andrew/template-typescript/node_modules/mocha/lib/nodejs/esm-utils.js:100:20)
    at async singleRun (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run-helpers.js:125:3)
    at async Object.exports.handler (/Users/andrew/template-typescript/node_modules/mocha/lib/cli/run.js:370:5)
```

### Narrative

Despite installing the `@types/mocha` package, the same errors persist when running the tests.

+ + +

|

+ +

To understand what might be causing the issue, let's examine the stack trace.

+

The stack trace reveals that ts-node is running, which is a positive sign. However, there's a noteworthy detail: 

+ +

Node.js is attempting to load CommonJS modules (CJS) instead of ES modules. This behavior occurs because Node.js defaults to CommonJS unless instructed otherwise.

To resolve this, we need to configure Node.js to use ES modules. Let's take the necessary steps to update our configuration and ensure Node uses the correct module loading behavior.

---

## Tell Node.js to use ES modules

`package.json`
```json [1-11|2]
{
    "type": "module",
    "scripts": {
        "test": "mocha --require 'ts-node/register' test.ts"
    },
    "devDependencies": {
        "@types/mocha": "10.0.1",
        "mocha": "^10.2.0",
        "ts-node": "^10.9.1"
    }
}
```

```sh [1-16|1|6|8-16|8]
> npm test

> test
> mocha --require 'ts-node/register' test.ts

TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/andrew/template-typescript/test.ts
    at new NodeError (node:internal/errors:399:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
    at new ModuleJob (node:internal/modules/esm/module_job:64:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:480:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34)
```

### Narrative

After setting the type property in the package.json file to module to enable native ES modules in Node.js, we encounter a familiar error where Node.js is unable to load TypeScript files.

+ + + +

Upon closer inspection of the stack trace, we notice that Node.js is indeed attempting to use ES modules, which is a positive development.

+

However, the error points to the get_format file, suggesting that there may be an issue with how Node.js is handling TypeScript files.

Let's investigate the problem further to understand why Node.js is not loading TypeScript files as expected, specifically in the context of the get_format file.

#### References:

* https://github.com/nodejs/node/blob/d402e2ab78130e554ae661b659e7791efb8cd3e3/lib/internal/modules/esm/get_format.js#L75

---

## Node's get_format.js

```js [1-26|3-5|7-8|12-24|25]
function getFileProtocolModuleFormat(url, context, ignoreErrors) {
  const ext = extname(url);
  if (ext === '.js') {
    return getPackageType(url) === 'module' ? 'module' : 'commonjs';
  }

  const format = extensionFormatMap[ext];
  if (format) return format;

  // Explicit undefined return indicates load hook should rerun format check
  if (ignoreErrors) { return undefined; }
  const filepath = fileURLToPath(url);
  let suggestion = '';
  if (getPackageType(url) === 'module' && ext === '') {
    const config = getPackageScopeConfig(url);
    const fileBasename = basename(filepath);
    const relativePath = StringPrototypeSlice(relative(config.pjsonPath, filepath), 1);
    suggestion = 'Loading extensionless files is not supported inside of ' +
      '"type":"module" package.json contexts. The package.json file ' +
      `${config.pjsonPath} caused this "type":"module" context. Try ` +
      `changing ${filepath} to have a file extension. Note the "bin" ` +
      'field of package.json can point to a file with an extension, for example ' +
      `{"type":"module","bin":{"${fileBasename}":"${relativePath}.js"}}`;
  }
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath, suggestion);
}
```

### Narrative

Looking at the `getFileProtocolModuleFormat` function in `get_format.js`, we can identify a few important behaviors:

+

* For JavaScript files, Node.js inspects the package to determine if it has opted in to be an ES module. Otherwise, it assumes it is a CommonJS module.

+ 

* When dealing with other file formats, Node.js looks for the file extension in a format map. However, it seems that ts-node is no longer registered as a handler for TypeScript files, causing our troubles.

+

* There is a block of code related to extensionless files, but it's not currently relevant to our situation.

+

* The issue is surfaced in the fact that `getFileProtocolModuleFormat` throws an error if it cannot find the required extension in the format registry.

After some research into how `ts-node` functions, there are in fact two ways register it with Node, depending on which module system you intend to support. Our current approach only works with CommonJS modules, and changing our package to an ES module prevents `ts-node` from loading at all.

Let's see if we can fix this problem by instructing `mocha` to use the correct registration with Node for ES module packages like ours.

---

## Tell mocha to use ts-node ES module loader

`.mocharc.json`
```json [1-3|2]
{
    "loader": "ts-node/esm"
}
```

`package.json`
```json [1-11|4]
{
    "type": "module",
    "scripts": {
        "test": "mocha test.ts"
    },
    "devDependencies": {
        "@types/mocha": "10.0.1",
        "mocha": "^10.2.0",
        "ts-node": "^10.9.1"
    }
}
```

```sh [1-29|1|6-7|10-17|19-22|23-25|26-29]
> npm test

> test
> mocha test.ts

(node:43486) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

TSError: ⨯ Unable to compile TypeScript:
test.ts:4:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

4 describe("generateTruth", () => {
  ~~~~~~~~
test.ts:5:5 - error TS2593: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

5     it("should be a function that returns true", () => {
      ~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at transformSource (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:400:37)
    at /Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:278:53
    at async addShortCircuitFlag (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:409:15)
    at async nextLoad (node:internal/modules/esm/loader:163:22)
    at async ESMLoader.load (node:internal/modules/esm/loader:605:20)
    at async ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:11)
    at async link (node:internal/modules/esm/module_job:68:21)
```

### Narrative

`mocha` allows us to provide runtime parameters to Node via a `.mocharc.json` file. Specifically, we can tell Node to use it's experimental ES module support with the `ts-node` ES module loader.

Removing the `ts-node` CommonJS hook from our test script and running `mocha` again confirms that Node's custom ESM loader is functioning as expected. We see the loader is running as Node provides us a warning message indicating that we are using this experimental feature.

+ + + +

|

+

However, despite this progress, there is still a missing piece of the puzzle. The stack trace shows that ts-node is using the same files, but it's now loading them using ESM. Node.js itself is also loading from ESM. So, what could be the missing element that is preventing us from achieving our goal?

Let's dive deeper into our `ts-node` configuration and investigate what could be the final piece we need to complete our journey.

#### References:

* https://typestrong.org/ts-node/docs/recipes/mocha/

---

## Tell ts-node to use ES modules

```sh [1-28|1|2-28|7-27|11,14,17|17]
npx ts-node --showConfig
{
  "ts-node": {
    "cwd": "/Users/andrew/template-typescript",
    "projectSearchDir": "/Users/andrew/template-typescript"
  },
  "compilerOptions": {
    "lib": [
      "es2021"
    ],
    "module": "node16",
    "target": "es2021",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node10",
    "types": [
      "node"
    ],
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": true,
    "declaration": false,
    "noEmit": false,
    "outDir": "./.ts-node"
  }
}
```

`tsconfig.json`
```json [1-7|2-6|3-5|4]
{
    "ts-node": {
        "compilerOptions": {
            "moduleResolution": "node16"
        }
    }
}
```

```sh [1-19|1|2-19|8-18|9,17|17]
npx ts-node --showConfig
{
  "ts-node": {
    "cwd": "/Users/andrew/template-typescript",
    "projectSearchDir": "/Users/andrew/template-typescript",
    "project": "/Users/andrew/template-typescript/tsconfig.json"
  },
  "compilerOptions": {
    "moduleResolution": "node16",
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": true,
    "declaration": false,
    "noEmit": false,
    "outDir": "./.ts-node",
    "target": "es5",
    "module": "commonjs"
  }
}
```

`tsconfig.json`
```json [1-8|4]
{
    "ts-node": {
        "compilerOptions": {
            "module": "ES6",
            "moduleResolution": "node16"
        }
    }
}
```

```sh [1-19|1|2-19|8-18|9-10|9]
npx ts-node --showConfig
{
  "ts-node": {
    "cwd": "/Users/andrew/template-typescript",
    "projectSearchDir": "/Users/andrew/template-typescript",
    "project": "/Users/andrew/template-typescript/tsconfig.json"
  },
  "compilerOptions": {
    "module": "es6",
    "moduleResolution": "node16",
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": true,
    "declaration": false,
    "noEmit": false,
    "outDir": "./.ts-node",
    "target": "es5"
  }
}
```

```sh [1-34|1|10-18|19-22|10-18]
> npm test

> test
> mocha test.ts

(node:44216) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

TSError: ⨯ Unable to compile TypeScript:
test.ts:1:8 - error TS1259: Module '"assert"' can only be default-imported using the 'allowSyntheticDefaultImports' flag

1 import assert from "assert";
         ~~~~~~

  node_modules/@types/node/assert.d.ts:967:5
    967     export = assert;
            ~~~~~~~~~~~~~~~~
    This module is declared with 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.
test.ts:2:31 - error TS2835: Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './generate-truth.js'?

2 import { generateTruth } from "./generate-truth";
                                ~~~~~~~~~~~~~~~~~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at transformSource (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:400:37)
    at /Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:278:53
    at async addShortCircuitFlag (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:409:15)
    at async nextLoad (node:internal/modules/esm/loader:163:22)
    at async ESMLoader.load (node:internal/modules/esm/loader:605:20)
    at async ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:11)
    at async link (node:internal/modules/esm/module_job:68:21)
```

### Narrative

+ + +

Upon examining the ts-node configuration, we gain insights into how it compiles our code. Three properties stand out as particularly useful:

+

* The `module` property determines how imports and exports are handled in the transpiled code.
* `esModuleInterop` acts as a workaround for certain TypeScript compatibility assumptions.
* `moduleResolution` determines how `ts-node` will itself load modules before transpilation.

+

The issue lies in the `moduleResolution` property, which is set to node10, an alias for CommonJS. This means that `ts-node` attempts to resolve modules in the CommonJS format, which is not our intention.

To address this, we can override `ts-node` using a tsconfig.json file. While typically used for TypeScript configuration, `tsconfig.json` can also be utilized for `ts-node`.

| + + +

We can set the `moduleResolution` property to `node16`, an alias for ES module support. This tells `ts-node` to use Node's native ES module loader when loading modules before it compiles our code.

+ + + + +

However, our configuration isn't complete yet. Upon reviewing the ts-node configuration again, we notice that the module option is mistakenly set to commonjs. To rectify this, we add an override to set the module property to ES6, the version of ECMAScript that introduced modules.

| + + + + + +

With the updated configuration, we finally have the module and moduleResolution properties correctly set.

| + + + +

Executing our test once more, we observe that the describe and it functions are loaded correctly. However, we encounter an error with our assert library and some issues with file extensions, which can be addressed in subsequent steps.

Let's go in order and fix our import syntax for the `assert` import.

#### References:

* https://www.typescriptlang.org/tsconfig#moduleResolution

---

## Use namespace import for assert

`test.ts`
```ts [1-8|1]
import * as assert from "assert";
import { generateTruth } from "./generate-truth";

describe("generateTruth", () => {
    it("should be a function that returns true", () => {
        assert.equal(generateTruth(), true);
    })
})
```

```sh [1-25|1|10-13]
> npm test

> test
> mocha test.ts

(node:44528) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

TSError: ⨯ Unable to compile TypeScript:
test.ts:2:31 - error TS2835: Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './generate-truth.js'?

2 import { generateTruth } from "./generate-truth";
                                ~~~~~~~~~~~~~~~~~~

    at createTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/Users/andrew/template-typescript/node_modules/ts-node/src/index.ts:1433:41)
    at transformSource (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:400:37)
    at /Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:278:53
    at async addShortCircuitFlag (/Users/andrew/template-typescript/node_modules/ts-node/src/esm.ts:409:15)
    at async nextLoad (node:internal/modules/esm/loader:163:22)
    at async ESMLoader.load (node:internal/modules/esm/loader:605:20)
    at async ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:11)
    at async link (node:internal/modules/esm/module_job:68:21)
```

### Narrative

+

To address the error with the `assert` library, we have multiple options, including revisiting the `esModuleInterop` setting that was mysteriously removed from our `ts-node` configuration. However, a simpler solution is to switch our default import into a namespace import.

By using a namespace import, we can gather all the exports from a module and assign them to an object of our choice. This approach should suffice for our needs.

+ +

Upon running the test again, we encounter one final compatibility issue that requires our attention. Let's brifly review how TypeScript handles ES module imports so that we can fix the issue in the next pass.

#### References

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import

---

## TypeScript ES module behaviour

![TypeScript ES module behaviour](/assets/typescript-ecmascript-behaviour.webp)
<!-- .element: class="r-stretch" -->
*[Announcing TypeScript 4.7: ECMAScript Module Support in Node.js](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#ecmascript-module-support-in-node-js)*

### Narrative

To summarize the linked article, TypeScript, Node, and `ts-node` handle ES module imports in a way that requires file extensions and leaves the import statements untouched by the compiler.

To ensure that TypeScript import statements work correctly in their transpiled JavaScript target files, it's necessary to add a `.js` extension to the TypeScript imports.

If you're interested in more details, you can refer to the article mentioned. Additionally, if you prefer automation, there are tools available that can assist you in automatically adding the required file extensions to your import statements.

---

## Use .js extension for relative imports

`test.ts`
```ts [1-8|2]
import * as assert from "assert";
import { generateTruth } from "./generate-truth.js";

describe("generateTruth", () => {
    it("should be a function that returns true", () => {
        assert.equal(generateTruth(), true);
    })
})
```

```sh [1-21|1|10-15|17-21|19]
npm test

> test
> mocha test.ts

(node:44900) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)


  generateTruth
    1) should be a function that returns true


  0 passing (4ms)
  1 failing

  1) generateTruth
       should be a function that returns true:
     AssertionError [ERR_ASSERTION]: undefined == true
      at Context.<anonymous> (file:///Users/andrew/template-typescript/test.ts:6:16)
      at processImmediate (node:internal/timers:476:21)
```

### Narrative

+ + + + + +

With the addition of the `.js` extension to the imports, running the tests finally gives us a failure. The failed assertion indicates that undefined indeed does not equal true.

At this point, it may be tempting to doubt the logic of such a simple statement. However, we are on the brink of success, and it is almost time for the test to pass. Let's proceed to resolving this final issue of an improper return type.

#### References

* https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions

---

### Pass the test!

`generate-truth.ts`
``` []
export const generateTruth = () => true;
```

```sh [1-14|1|10-14|11]
npm test

> test
> mocha test.ts

(node:45234) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)


  generateTruth
    ✔ should be a function that returns true


  1 passing (3ms)
```

### Narrative

By returning `true` from the `generateTruth` function, the test finally passes!

+ + +

After all the TDD discipline and effort, we have successfully achieved our goals.

We have TypeScript and ES modules working in symphony that serenades us atop the TDD mountain. We are rewarded with a delightful mochachino and a mint chocolate check mark for dessert.

Congratulations on reaching the summit of your testing journey! Cheers to your success!

---

## Now, we can refactor!

`mocharc.json`
```json [1-4|3]
{
    "loader": "ts-node/esm",
    "spec": "test.ts"
}
```

`package.json`
```json [1-14|4|11-13]
{
    "type": "module",
    "scripts": {
        "test": "mocha"
    },
    "devDependencies": {
        "@types/mocha": "10.0.1",
        "mocha": "^10.2.0",
        "ts-node": "^10.9.1"
    },
    "engines": {
        "node": "^18.0.0"
    }
}
```

`tsconfig.json`
```json [1-9|3]
{
    "ts-node": {
        "esm": true,
        "compilerOptions": {
            "module": "ES6",
            "moduleResolution": "node16"
        }
    }
}
```

`mocha-bootstrap.ts`
```ts []
import { main } from "mocha/lib/cli/cli.js";
main();
```

`test.ts`
```ts [1-9|1]
import { describe, it } from "mocha";
import * as assert from "assert";
import { generateTruth } from "./generate-truth.js";

describe("generateTruth", () => {
    it("should be a function that returns true", () => {
        assert.equal(generateTruth(), true);
    })
})
```

### Narrative


Now that we have our passing test we can put the finishing touches on our repository with a few refactoring tasks:

+ +

We will add the spec property to the `.mocharc.json` file and remove it from our test script. This ensures that mocha configuration is unified.

+

To avoid a known bug in Node 20, we will specify Node version 18 in the `package.json` file. If you'd like to know more check the link below.

| +

We will add the `esm` flag to the `tsconfig.json` file. This ensures `ts-node` will use ES modules whenever it is loaded.

We'll add a `mocha-bootstrap.ts` file to test running `mocha` without using the `mocha` CLI. This allows us to use `ts-node` directly and emit the compiled JavaScript code if we are unsure if the compilation process is creating an issue.

+

We will explicitly import `mocha`'s `describe` and `it` globals in our tests to ensure they are working correctly without relying on any globally injected state from the CLI. This will help us if we want to test compatibility in the browser.

With these final adjustments, we can confidently complete our TDD journey and ensure that our repository is in a robust and reliable state.

---

# Thanks!

![Success!](/assets/check.png)
<!-- .element: class="r-stretch" -->
*[Lineal Color icons created by Freepik](https://www.flaticon.com/authors/kawaii/lineal-color)*

### Narrative

Thank you for joining on this journey to set up testing with TypeScript and ES modules! Hopefully this presentation has provided you with valuable insights and guidance for your own projects.

To further explore and apply what you've learned, we encourage you to clone the linked template repository. This template offers a minimal, test-driven setup that utilizes ES modules, making it compatible with engines like Node.js, Deno, and modern browsers. With this template, you can continue building and testing your TypeScript code with confidence.

We appreciate your time and interest in this topic. If you have any further questions or need additional assistance, please don't hesitate to reach out. Happy testing and happy coding!

Thanks!