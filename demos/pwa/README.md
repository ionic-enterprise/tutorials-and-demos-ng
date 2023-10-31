# Tea Taster

An application for storing tea tasting notes. This application is the output of the <a href="" target="_blank">three day Ionic Framework Enterprise training.</a> It is also used as the starting point for some of our other product demos such as the demos for Identity Vault and Auth Connect.

## Building

If you would like to build this application yourself, do the following:

- Clone this repo
- `cd tea-taster-ng`
- Do one of the following:
  - **Best**: Make sure you have access to Identity Vault and Auth Connect, and have previously registered an application using the [`ionic enterprise register`](https://ionicframework.com/docs/cli/commands/enterprise-register) command (which generates an .npmrc file). Copy the generated file to the root of this project.
  - **Alternate**: create a banch ([see below](#branching-refresher)) at the appropriate commit or tag prior to Identity Vault and Auth Connect being added to the application.
- `npm i`
- `npm run build`
- `npx cap sync`

At this point, you should be able to either run the application in a dev server via `npm start` or on a device using `npx cap open ios` (or `android`).

## Credentials

This application uses a live backend API that requires a login. Unless you have your own credentials, please use the following:

- **email:** `test@ionic.io`
- **password:** `Ion54321`

## The `main` Branch

The HEAD of `main` contains the original Tea Taster app developed during training with the following additions:

- Ongoing dependency updates (remember to include dependency updates in your own sprint planning at least a couple of times per year).
- Using Identity Vault and Auth Connect to provide a complete and secure authentication solution.
- Using the [Angular PWA Toolkit](https://angular.io/guide/service-worker-intro) to implement a PWA.
- Ongoing bug fixes or minor training related modifications.

The HEAD of `main` should be useful for most exploration, assuming you have access to Identity Vault and Auth Connect.

### Step Commits

Each step of the training has its own commit within the `main` branch. You should be able to use this information to gather a general idea of the various changes that were needed at each step of the development of this application. However, if code needs to be modified to support later changes (such as a significant change to a dependency), that coding change will only be reflected in later commits, so the commits themselves should only be used as a guide as needed.

### Tags

Specific key commits are tagged in case you would like to examine the state of the project at specific key events:

- `end-of-training` - This is the end of the standard three day [training](https://ionic-training-decks.firebaseapp.com/course/framework/tabs/angular/page/0) and does not contain any of the extra credit exercises, minor bug fixes, or minor modifications to the training.
- `end-basic-extra-credit` - This commit incorporates all of the extra credit assignments. Each assignment, though, has its own commit(s).
- `identity-vault` - This commit replaces the basic session storage with Identity Vault.
- `auth-connect` - In addition to using Identity Vault for session storage, this commit replaces the basic authentication scheme with using OIDC via Auth Connect for better security.
- `pwa` - The final step of a simple PWA implementation.

### PWA Quirks

The PWA implementation has a couple of quirks that _could_ be solved in a few different ways. This is beyond the scope of this demo, but would be quite easy to accomplish depending on how you want to handle them.

- **Session Storage**: The web implementation is currently using the [Browser Vault](https://ionic.io/docs/identity-vault/classes/browservault), which uses session storage. The result is the user needs to "log in" each time they restart the app. The user may still be logged in via AWS Cognito, which means they will not need to enter any credentials, but they still need to go through the process. The easiest adaptation here is to create your own web-based session storage service that uses the same interface as the Browser Vault.
- **Safari Popup Warning**: Safari warns about opening a pop-up window. This is because Auth Connect is using a separate tab for login. You can implement the "current" [`uiMode`](https://ionic.io/docs/auth-connect/interfaces/WebOptions#uimode) if desired. This is an advanced option that requires special handling for the application startup code, and is beyond te scope of this demo.

### Branching Refresher

As a reminder, you can create a branch at any commit or tag as such:

- `git checkout -b new-branch-name tree-ish` (example: `git checkout -b my-new-branch ac2ca2b`)
- `git checkout -b new-branch-name tag-name` (example: `git checkout -b my-new-branch end-of-training`)

If you would like a refresher on other options with `git`, have a look at our [concise `git` guide](https://ionic-training-decks.firebaseapp.com/course/git-workflow).

Happy Coding! 🤓
