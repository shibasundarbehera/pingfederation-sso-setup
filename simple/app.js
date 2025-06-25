console.log('app.js loaded'); // Confirm JS is loaded

// === Configuration ===
const siteBSSOGateway = 'https://app.ssb.co.uk/securelogin/samlgateway.aspx?id=12df34e-1234-1234-1234-234df56789'; // Site B SSO gateway URL
const siteALoginURL = '/login'; // SPA login or IdP-initiated login path

// === Token-based auth check (if Site A stores SSO session this way) ===
function isAuthenticated() {
    console.log('[Auth] Checking if user is authenticated on Site A');

    const idToken = localStorage.getItem('id_token'); // adjust if you're using cookies/sessionStorage
    if (!idToken) {
        console.warn('[Auth] ID token not found');
        return false;
    }

    try {
        const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const expiry = payload.exp * 1000;
        const valid = Date.now() < expiry;
        console.log('[Auth] Token valid:', valid, '| Expires:', new Date(expiry));
        return valid;
    } catch (e) {
        console.error('[Auth] Invalid token:', e);
        return false;
    }
}

// === Redirect Logic to Site B ===
function redirectToSiteB() {
    console.log('[Redirect] Redirect to Site B requested');

    // if (!isAuthenticated()) {
    //     console.warn('[Redirect] User not authenticated. Redirecting to Site A login.');
    //     window.location.href = siteALoginURL;
    //     return;
    // }

    console.log('[Redirect] User authenticated. Redirecting to Site B SSO gateway...');
    window.location.href = siteBSSOGateway;
}
