import React from 'react';
import './NavigationMenu.css';

const oidcConfig = {
    idpAuthorizeUrl: 'https://idp.pingidentity.com/authorize', // Replace
    siteBClientId: 'site-b-client-id', // Replace
    redirectUri: 'https://siteb.com/callback', // Replace
    landingPage: 'https://siteb.com/landing', // Replace
    scope: 'openid profile'
};

const isAuthenticated = () => {
    console.log('Checking authentication status');
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
        console.log('No ID token found');
        return false;
    }
    try {
        const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const expiry = payload.exp * 1000;
        const isValid = Date.now() < expiry;
        console.log('ID token valid:', isValid, 'Expiry:', new Date(expiry));
        return isValid;
    } catch (e) {
        console.error('Error parsing ID token:', e);
        return false;
    }
};

const redirectToSiteALogin = () => {
    console.log('Redirecting to Site A login');
    window.location.href = '/login';
};

const redirectToSiteB = () => {
    console.log('Initiating redirect to Site B');
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
        console.log('Redirect URL:', redirectUrl);
        window.location.href = redirectUrl;
    } catch (error) {
        console.error('Failed to initiate OIDC redirect:', error);
        alert('Error redirecting to Site B. Please try again.');
    }
};

const NavigationMenu = () => {
    return (
        <div className="dropdown">
            <button className="dropbtn">Navigate to Other Sites</button>
            <div className="dropdown-content">
                <a onClick={redirectToSiteB}>Go to Site B</a>
                <a href="#">Other Site (Placeholder)</a>
            </div>
        </div>
    );
};

export default NavigationMenu;