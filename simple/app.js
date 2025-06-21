console.log('app.js loaded'); // Debug: Confirm script loading

const oidcConfig = {
    idpAuthorizeUrl: 'https://idp.pingidentity.com/authorize', // Replace with actual PingIdentity endpoint
    siteBClientId: 'site-b-client-id', // Replace with Site B's client ID
    redirectUri: 'https://siteb.com/callback', // Replace with Site B's redirect URI
    landingPage: 'https://siteb.com/landing', // Replace with desired landing page
    scope: 'openid profile'
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}


function isAuthenticated() {
    console.log('Checking authentication status'); // Debug
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
        console.log('No ID token found in localStorage');
        return false;
    }

    try {
        // Decode JWT payload (base64url decoding)
        const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        const isValid = Date.now() < expiry;
        console.log('ID token valid:', isValid, 'Expiry:', new Date(expiry));
        return isValid;
    } catch (e) {
        console.error('Error parsing ID token:', e);
        return false;
    }
}

function redirectToSiteALogin() {
    console.log('Redirecting to Site A login');
    window.location.href = '/login'; // Adjust to your SPA's login route
}

function redirectToSiteB() {
    console.log('Initiating redirect to Site B'); // Debug
    if (!isAuthenticated()) {
        console.warn('User not authenticated, redirecting to login');
        redirectToSiteALogin();
        return;
    }

    try {
        const params = new URLSearchParams({
            client_id: oidcConfig.siteBClientId,
            response_type: 'code',
            scope: oidcConfig.scope,
            redirect_uri: oidcConfig.redirectUri,
            state: encodeURIComponent(oidcConfig.landingPage)
        });

        const redirectUrl = `${oidcConfig.idpAuthorizeUrl}?${params.toString()}`;
        console.log('Redirect URL:', redirectUrl); // Debug: Log URL
        window.location.href = redirectUrl;
    } catch (error) {
        console.error('Failed to initiate OIDC redirect:', error);
        alert('Error redirecting to Site B. Please try again.');
    }
}