import * as webauthn from '@passwordless-id/webauthn';

class Biometric {
  async register() {
    try {
      // const options = await fetch("/api/generate-registration-options").then(res => res.json());
      // const registrationResponse = await startRegistration(options);
      // await fetch("/api/verify-registration", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(registrationResponse)
      // });

        const isAvailable = webauthn.client.isAvailable();
        if (!isAvailable) {
            // showError({ message: 'Platform not support' });
            return;
        }

        const isLocalAuthenticator = await webauthn.client.isLocalAuthenticator();

        if (!isLocalAuthenticator) {
            // showError({ message: 'Device not support' });
            return;
        }

    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  async authenticate() {
    try {
      // const options = await fetch("/api/generate-authentication-options").then(res => res.json());
      // const authenticationResponse = await startAuthentication(options);
      // await fetch("/api/verify-authentication", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(authenticationResponse)
      // });
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  }
}

export default Biometric;