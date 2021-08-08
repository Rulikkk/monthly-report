import { useState, useEffect } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import * as config from "../../auth0.config";

/** Provide state for the UserContext */
export function useAuth0() {
  let [auth0Client, setAuth0Client] = useState();

  let [isLoading, setLoading] = useState(true);
  let [isAuth, setAuth] = useState(false);
  let [profile, setProfile] = useState(null);
  let [error, setError] = useState(null);

  /** Login with redirect */
  let login = () => {
    auth0Client?.loginWithRedirect({ audience: "http://localhost:3000" });
  };

  /** Logout with redirect */
  let logout = () => {
    auth0Client?.logout();
  };

  let handleRedirect = async () =>
    new Promise(async (resolve, reject) => {
      try {
        await auth0Client?.handleRedirectCallback();
        history.pushState("", document.title, location.pathname);
        resolve(await auth0Client?.getIdTokenClaims());
      } catch (err) {
        reject(err);
      }
    });

  let checkSession = async () =>
    new Promise(async (resolve, reject) => {
      try {
        await auth0Client?.getTokenSilently();
        resolve(await auth0Client?.getIdTokenClaims());
      } catch (err) {
        reject(err);
      }
    });

  useEffect(() => {
    createAuth0Client(config).then(setAuth0Client);
  }, []);

  useEffect(() => {
    setLoading(!profile && !error);
    setAuth(!!profile);
  }, [error, profile]);

  useEffect(() => {
    if (!auth0Client) return;
    let isRedirect = location.search.startsWith("?code=");
    if (isRedirect) {
      handleRedirect().then(setProfile).catch(setError);
    } else {
      checkSession().then(setProfile).catch(setError);
    }
  }, [auth0Client]);

  return { profile, isAuth, isLoading, error, login, logout };
}
