# pingfederation-sso-setup

This project demonstrates how to implement Single Sign-On (SSO) using PingIdentity (PingOne or PingFederate) with OpenID Connect (OIDC) to redirect users from **Site A** to **Site B** without requiring re-authentication. It includes two implementations:

1. **Simple SPA**: A vanilla JavaScript SPA in the `/simple` folder, using `index.html` and `app.js`.
2. **React SPA**: A React-based SPA in the `/react-sso-app` folder.

Both applications feature an HTML menu that triggers an OIDC authorization code flow to redirect users to Site B, leveraging an existing SSO session with PingIdentity.

## Prerequisites

- **PingIdentity Setup**:
  - Both Site A and Site B must be registered as OIDC clients in PingIdentity (PingOne or PingFederate).
  - Obtain the following for Site B:
    - Client ID (`site-b-client-id`).
    - Redirect URI (e.g., `https://siteb.com/callback`).
    - Authorization Endpoint (e.g., `https://idp.pingidentity.com/authorize`).
  - Ensure Site A has an active SSO session (e.g., via an ID token stored in `localStorage`).
- **Node.js** (for React app): Version 16 or higher.
- **Browser**: Modern browser (Chrome, Firefox, Edge) with cookies enabled for PingIdentity session management.
- **Development Environment**: Code editor (e.g., VS Code) and terminal.

## Project Structure

```
pingfederation-sso-setup/
├── simple/
│   ├── index.html       # HTML menu for vanilla JS SPA
│   └── app.js           # JavaScript for OIDC redirect logic
├── react-sso-app/
│   ├── src/components
│   │   ├── NavigationMenu.jsx  # React component for menu
│   │   ├── NavigationMenu.css  # CSS for menu
│   │   └── App.jsx             # Main React app
│   ├── package.json            # React dependencies and scripts
│   └── ...                     # Other React files
├── README.md                   # Project documentation
```

## Setup Instructions

### 1. Simple SPA (`/simple`)

The vanilla JavaScript SPA requires no build tools and can be served statically.

#### Steps to Run:
1. **Configure OIDC Parameters**:
   - Open `simple/app.js` and update the `oidcConfig` object with your PingIdentity and Site B details:
     ```javascript
     const oidcConfig = {
         idpAuthorizeUrl: 'https://idp.pingidentity.com/authorize', // PingIdentity OIDC endpoint
         siteBClientId: 'site-b-client-id', // Site B's client ID
         redirectUri: 'https://siteb.com/callback', // Site B's redirect URI
         landingPage: 'https://siteb.com/landing', // Site B landing page
         scope: 'openid profile'
     };
     ```
2. **Serve the SPA**:
   - Use a static file server (e.g., Python’s `http.server`, Node.js `http-server`, or VS Code’s Live Server).
   - Example with Python:
     ```bash
     cd simple
     python -m http.server 8080
     ```
   - Access the app at `http://localhost:8080`.
3. **Test the Redirect**:
   - Ensure you’re logged into Site A with a valid PingIdentity SSO session (ID token in `localStorage`).
   - Open the dropdown menu, click “Go to Site B”, and verify redirection to Site B without a login prompt.

#### Notes:
- The ID token is assumed to be stored in `localStorage` as `id_token`. Adjust `isAuthenticated()` in `app.js` if your SPA uses `sessionStorage` or cookies.
- Serve over HTTPS in production to secure OIDC redirects.

### 2. React SPA (`/react-sso-app`)

The React SPA requires Node.js and npm to install dependencies and run the development server.

#### Steps to Run:
1. **Install Dependencies**:
   - Navigate to the React app folder:
     ```bash
     cd react-sso-app
     npm install
     ```
2. **Configure OIDC Parameters**:
   - Open `react-sso-app/src/NavigationMenu.jsx` and update the `oidcConfig` object:
     ```javascript
     const oidcConfig = {
         idpAuthorizeUrl: 'https://idp.pingidentity.com/authorize',
         siteBClientId: 'site-b-client-id',
         redirectUri: 'https://siteb.com/callback',
         landingPage: 'https://siteb.com/landing',
         scope: 'openid profile'
     };
     ```
3. **Run the Development Server**:
   - Start the React app:
     ```bash
     npm run dev
     ```
   - The app typically runs at `http://localhost:3000` (check terminal output for the exact URL).
4. **Test the Redirect**:
   - Log into Site A with a PingIdentity SSO session.
   - Open the dropdown menu, click “Go to Site B”, and confirm redirection to Site B’s landing page.

#### Notes:
- Requires Node.js and npm installed globally.
- Ensure Vite (or your build tool) is configured correctly in `package.json`.
- Use HTTPS in production (e.g., via a reverse proxy like Nginx).

## How It Works

1. **HTML Menu**:
   - Both SPAs feature a dropdown menu with a “Go to Site B” link.
   - Clicking the link triggers `redirectToSiteB()`, which constructs an OIDC authorization URL.
2. **OIDC Redirect**:
   - The URL follows the format:
     ```
     {idpAuthorizeUrl}?client_id={siteBClientId}&response_type=code&scope=openid%20profile&redirect_uri={encodedRedirectUri}&state={encodedState}
     ```
   - Redirects to PingIdentity’s authorization endpoint.
3. **PingIdentity Flow**:
   - The IdP checks for an active SSO session (e.g., cookie or token).
   - If valid, redirects to Site B’s `redirectUri` with an authorization code.
   - Site B exchanges the code for tokens and grants access, bypassing the login page.
   - The `state` parameter specifies the landing page (e.g., `https://siteb.com/landing`).
4. **Authentication Check**:
   - `isAuthenticated()` verifies a valid ID token in `localStorage`.
   - If unauthenticated, redirects to Site A’s login page (`/login`).

## Dependencies

- **Simple SPA**:
  - None (pure HTML/JavaScript).
  - Optional: Static file server (e.g., `http-server` via `npm install -g http-server`).
- **React SPA**:
  - Node.js (v16+)
  - npm packages (listed in `react-sso-app/package.json`):
    - `react`, `react-dom`
    - `vite` (or other build tool, e.g., `create-react-app`)
  - Install with `npm install` in `react-sso-app`.

## Configuration

Replace placeholder values in `simple/app.js` or `react-sso-app/src/NavigationMenu.jsx` with actual PingIdentity/Site B details:

| Parameter         | Description                              | Example Value                          |
|-------------------|------------------------------------------|----------------------------------------|
| `idpAuthorizeUrl` | PingIdentity OIDC authorization endpoint | `https://auth.pingone.com/tenant/authorize` |
| `siteBClientId`   | Site B’s OIDC client ID                 | `site-b-client-id`                     |
| `redirectUri`     | Site B’s callback URL                   | `https://siteb.com/callback`           |
| `landingPage`     | Site B’s landing page (for `state`)      | `https://siteb.com/landing`            |
| `scope`           | OIDC scopes requested                   | `openid profile email`                 |

- **PingIdentity Admin Console**:
  - Register Site B as an OIDC client with the above `clientId` and `redirectUri`.
  - Ensure `scope` includes `openid` (required for OIDC).
  - Verify Site A is configured for SSO login.

## Troubleshooting

- **Clicking “Go to Site B” Does Nothing**:
  - **Console Errors**: Open DevTools (F12 → Console) and check for errors (e.g., `redirectToSiteB not defined`, `No ID token found`).
  - **Script Loading**: Ensure `app.js` loads (check Network tab for 404). Adjust `<script src="/js/app.js">` path.
  - **Event Handler**: For React, confirm `onClick={redirectToSiteB}` is used, not `onclick`.
  - **Authentication**: Verify `id_token` exists in `localStorage` (e.g., `localStorage.getItem('id_token')`). If missing, check Site A’s login flow.
- **Redirect Fails**:
  - **OIDC URL**: Log `redirectUrl` in `redirectToSiteB()` and test it manually in a browser.
  - **Configuration**: Ensure `oidcConfig` values match PingIdentity’s settings.
  - **Session**: Confirm an active SSO session (IdP cookie, e.g., `PF` for PingFederate).
- **Site B Prompts for Login**:
  - **Session Expired**: Log into Site A again to refresh the IdP session.
  - **Misconfiguration**: Verify `siteBClientId`, `redirectUri`, and `scope` in PingIdentity’s admin console.
  - **Debugging**: Use browser Network tab to trace redirects or PingIdentity logs for errors.
- **React Issues**:
  - Run `npm install` if dependencies are missing.
  - Check `npm run dev` output for build errors.

## Security Considerations

- **HTTPS**: Serve both SPAs over HTTPS in production to secure OIDC tokens.
- **State Parameter**: Prevents CSRF attacks and specifies the landing page.
- **Token Storage**: `localStorage` is used for simplicity. In production, consider `HttpOnly` cookies or secure storage to prevent XSS.
- **PKCE**: Recommended for SPAs (add `code_challenge` and `code_challenge_method=S256` to the OIDC URL if required by PingIdentity).
- **CORS**: Ensure PingIdentity allows CORS for token validation APIs (if used).

## Development Notes

- **Simple SPA**: Ideal for lightweight applications or prototyping. No build step required.
- **React SPA**: Suitable for modern, component-based apps. Requires Node.js setup.
- **Extensibility**: Add more menu items to redirect to other SSO-enabled sites by updating `oidcConfig`.
- **Debugging**: Enable console logs in `app.js` or `NavigationMenu.jsx` to trace issues.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

SSB License. See `LICENSE` file for details.

## Contact

For issues or questions, open an issue on the repository or contact the project maintainer.
