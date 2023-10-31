# Angular Auth Playground

This application highlights the use of the Ionic Enterprise <a href="https://ionic.io/docs/auth-connect" target="_blank">Auth Connect</a> and <a href="https://ionic.io/docs/identity-vault/" target="_blank">Identity Vault</a> products in an Angular application. The application runs on both Android and iOS. In addition, it supports running in the web, allowing developers to remain in the more comfortable and productive web-based development environments while working on the application. Since the web does not have a secure biometrically locked key storage mechanism, however, the full potential of Identity Vault is only accessible through the native platforms.

This application uses <a href="https://capacitorjs.com/docs" target="_blank">Capacitor</a> to provide the native layer. This is the preferred technology to use for the native layer. The Customer Success team highly suggests using it over Cordova. However, Identity Vault and Auth Connect can both be used with either technology.

The purpose of this application is to show the use of much of the `Vault` and `Device` APIs of Identity Vault as well as how Identity Vault and Auth Connect work together to provide a secure authentication solution.

## Building and Running

If you would like to build this app you need to have access to both Identity Vault and Auth Connect, and you will have had to run the <a href="https://ionic.io/docs/supported-plugins/setup#register-your-product-key" target="_blank">registration process</a> on one of your applications. Once you have done that, you can copy the `.npmrc` file from that application to this one in order to gain access to the native solutions.

Once the access is set up, the build processes is the same as for most Ionic applications:

- `npm install`
- `npm run build`
- to start a development server: `npm start`
- to run on an Android device: `ionic cap run android`
- to run on an iOS device: `ionic cap run ios` (you may need to run `ionic cap start ios` and update the development team)

One final note: this app may or may not work on an emulator. When working with biometrics it is highly suggested that you test only on actual devices and skip the emulators.

## Significant Architecture

### The Session Vault Service

The session vault service defines the interface to the Identity Vault. When being used in an application that also uses Auth Connect, this service will typically do the following:

- Instantiate the `Vault` object.
- Expose the `Vault` object so it can be used by Auth Connect as a token storage provider.
- Expose any methods needed throughout the rest of the system, even if the methods just pass-through to a method on the `Vault` object.

Typically, the added methods would be ones like:

- `unlock()`
- `canUnlock()`
- `initializeUnlockMode()`
- `setUnlockMode()`

We have gone beyond that with this application so we could allow the user to manually perform some vault operations that would typically be automatically managed by either Auth Connect or Identity Vault (`lock()`, `clear()`, etc).

**Important:** you may ask why we create methods like `unlock()` that just pass through to the vault's `unlock()`. The reason for this is to create an adaptor class layer to protect the rest of the application from potential changes to the Identity Vault API. Creating an adapter class is a good pattern to follow with any external dependency to your application.

### The Authentication Services

#### Authentication Expediter Service

The `AuthenticationExpediterService` is a layer that allows us to use different methods for authentication, and then manages how the user is currently authenticated so the proper flows can be followed. The idea is to abstract all of the associated business logic of managing the provider to this layer.

In an architecture that support only one provider (which is more typical), this layer is not necessary and you would directly use the single `AuthenticationService` instead. That is, you would likely have a single `AuthenticationService` that is similar to this application's `AwsAuthenticationService`, and you would directly use it instead.

#### AWS Authentication Service

The `AwsAuthenticationService` is how this application interfaces with Auth Connect in order to provide access to our AWS Cognito authentication provider. This service only needs to provide the proper configuration. You can override existing methods or add new ones if you need to provide more functionality.

#### Azure Authentication Service

The `AzureAuthenticationService` is how this application interfaces with Auth Connect in order to provide access to our Azure Active Directory authentication provider. This service provides the proper configuration as well as overrides the `login()` method due to some peculiarities with how a password change needs to be handled with Azure.

#### Basic Authentication Service

The `BasicAuthenticationService` is used to perform a basic HTTP based authentication where the application itself gathers the credentials and then sends them to the backend to be verified and a token is returned. This is easily the least secure of all of the methods presented because:

- The application obtains the credentials instead of the backend system performing the authentication.
- As a result, those credentials are sent across the wire to the backend that will do the authentication.
- The protocol we have implemented has a single long-lived token rather than short lived tokens with a long lived refresh token.

Obviously, some of this we could do some work to get around. However, the fact that the user stays in the app in order to enter their credentials is a serious flaw that would take more work to get around. This makes using Auth Connect with the OIDC providers a far better choice for applications where security is important.

#### The Token Storage Provider

With the OIDC related services, we also specify a token storage provider in the form of our `SessionVaultService`. If you do not specify a token storage provider, Auth Connect will use a default provider that utilizes `localstorage`. The default provider, however, is only intended for development use. In a production scenario we suggest pairing Auth Connect with Identity Vault as we do here. Doing so provides a complete authentication solution.

### The PIN Dialog

The `Vault` API contains an `onPasscodeRequest()` callback that is used to get the passcode when using a Custom Passcode type of vault. The method and workflow used to obtain the passcode is determined by the application, the only requirement is to call `setCustomPasscode()` from within `onPasscodeRequest()`. For example:

```typescript
  private async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<void> {
    const { data } = await someWayOfGettingThePasscode(isPasscodeSetRequest);
    this.vault.setCustomPasscode(data || '');
  }
```

For this application, we chose to use a modal dialog to get the custom passcode. Moreover, we chose to use the same component for initially setting the passcode as we use for getting the passcode when unlocking the vault.

Our component implements a different workflow depending on whether `setPasscodeMode` is `true` (ask the user twice, do not allow a "cancel") or `false` (ask once, allow a "cancel").

```typescript
  private async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<void> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    this.vault.setCustomPasscode(data || '');
  }
```

### Auth Guard

This application has a single route guard that determines if the user is authenticated. It redirects to the login page if they are not. To determine if the user is authenticated, it uses Auth Connect's `isAuthenticated()` method. This method resolves `true` or `false` depending on whether or not a non-expired access token exists. If the token exists but is expired, it will attempt a refresh operation first if the backend provider supports refresh tokens.

### HTTP Interceptors

#### The Auth Interceptor

The Auth interceptor operates on outbound requests. It gets the access token from the authentication service and appends it to the headers as a bearer token.

If an access token cannot be obtained, the request will still be sent, but it will be sent without a bearer token. In such a case, if the API requires a token in order to process the request it should result in a 401 error.

#### The Unauth Interceptor

The Unauth interceptor examines HTTP responses and redirects to the login page when result has a 401 error status.

## Pages

### Login Page

The login page allows the user to authenticate themselves via any of our providers. The AWS provider as well as the "Sign in with email" option use the following credentials:

- **email:** `test@ionic.io`
- **password:** `Ion54321`

The Azure OIDC provider may work with your Google account.

This page will automatically be displayed whenever the application detects that the user is not currently authenticated.

### Unlock Page

The unlock page gives the user two options:

1. Unlock the vault and navigate into the app
1. Perform a logout, which will clear the vault, and navigate to the login page

### The Tabbed Pages

#### Tea List

The Tea List page just shows a list of teas. Every time the user navigates to this page, the backend API will refetch the data (even though it never actually changes). This page simulates the way an actual application would work. That is, the user goes to the page, the correct token is obtained from the vault, and an API call is made using that token.

#### Vault Config

This is not a page you would typically have in an application, but you may use some of the items or ideas from here in various parts of a real application. The Vault Config page allows the user to select various vault locking mechanisms. It also allows the user to lock the vault, clear the vault, or manually show the biometric prompt.

Child pages allow the user to add/remove items from the vault and to have a look at the Device API values as well as manipulate some of the Device settings.

#### About

This page just has some basic information about the app so the user knows what they have installed.

This is also the page that contains the logout button.
