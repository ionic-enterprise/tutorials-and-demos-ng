# Tea Taster

An application for storing tea tasting notes. This application is the output of the <a href="" target="_blank">three day Ionic Framework Enterprise training.</a> It is also used as the starting point for some of our other product demos such as the demos for Identity Vault and Auth Connect.

## Building

If you would like to build this application yourself, do the following:

- Clone this repo
- `cd tea-taster-ng`
- `npm i`
- `npm run build`
- `ionic cap sync`

At this point, you should be able to either run the application in a dev server via `ionic start` or on a device using `ionic cap open ios` (or `android`).

## Commits

Each step of the training has its own commit within the `main` branch. You should be able to use this information to gather a general idea of the various changes that were needed at each step of the development of this application. However, if code needs to be modified to support later changes (such as a significant change to a dependency), that coding change will only be reflected in later commits, so the commits themselves should only be used as a guide as needed.

## Credentials

This application uses a live backend API that requires a login. Unless you have your own credentials, please use the following:

- **email:** `test@ionic.io`
- **password:** `Ion54321`

## Branches

**Note:** only the main branch exists at this time. The other branches will be recreated after the official Ionic v7 release.

- `main` - shows the completed `@ionic/angular` three-day Enterprise training project. This project is used as the basis for other trainings
- `feature/pwa` - shows the completed `@ionic/angular` PWA training. In this training, we use the Angular PWA toolkit to add a service worker and webapp manifest to our project. We also add an application service that listens for updates to the PWA and offers to restart when a complete update is available. This version of the application can be deployed as a hybrid native application (iOS and Android) or as a PWA using the same code base.
- `feature/identity-vault` - shows the completed Identity Vault training for `@ionic/angular` applications. This branch also contains a few "demo" features that are not included in the training making it suitable for a customer-facing demo.
- `feature/auth-connect` - shows the completed Auth Connect with Identity Vault training for `@ionic/angular` applications. This branch is also being used as our demo application for using AuthConnect with Identity Vault. This branch is build on top of `feature/identity-vault` with all of those changes squashed into "step(zero)" so it can logically reamin independent of the IV-only branch.

Each of the branches has a similar structure to `main` whereby each step is signified by its own commit in the branch.

Happy Coding!
