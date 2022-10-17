import { ContexState } from "../context-manager/ContextState";
import { StorageUtil } from "../util/local-storage/StorageUtil";
import { STORAGE_KEYS } from "../util/local-storage/SotrageKeys";
import { EnvironmentUtil } from '../util/environment/EnvironmentUtil'
import { ReflectionUtil } from '../util/ReflectionUtil'
import { ENVIRONEMNT_KEYS } from '../util/environment/EnvironmentKeys'
// import jwtDecode from "jwt-decode";

const AUTHORIZATION_HEADER_KEY = `Authorization`
const HTTPS_SCHEMA = `https`
const SCHEMA = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `http` : HTTPS_SCHEMA
const BASE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `localhost` : EnvironmentUtil.get(ENVIRONEMNT_KEYS.BASE_HOST)
const SITE_HOST = EnvironmentUtil.isLocal() || EnvironmentUtil.isLocalToDevelopment() ? `${BASE_HOST}:7890` : `studies.${BASE_HOST}` 
const API_HOST = EnvironmentUtil.isDevelopment() || EnvironmentUtil.isLocalToDevelopment() ? EnvironmentUtil.get(ENVIRONEMNT_KEYS.AUTHENTICATION_API_HOST) : `${BASE_HOST}:7889` 
const API_BASE_URL = `${EnvironmentUtil.isLocalToDevelopment() ? HTTPS_SCHEMA : SCHEMA}://${API_HOST}/authentication-manager-api`

export class AuthenticationService extends ContexState {

    constructor() {
        super()
        this.state = {
            loginData: StorageUtil.get(STORAGE_KEYS.LOGIN_DATA_KEY, null),
            authorization: StorageUtil.get(STORAGE_KEYS.AUTHORIZATION_DATA_KEY, null)
        }
    }

    setLoginData = (loginData: any) => {
        !!loginData ? this.setState({loginData: {...loginData}}) : this.setState({loginData: null})
    }
    
    setAuthentication = (loginData: any) => {
        this.setLoginData(loginData)
        StorageUtil.set(STORAGE_KEYS.LOGIN_DATA_KEY, loginData)
    }
    
    getAuthentication = () => {
        return this.state.loginData
    }
    
    setAuthorization = (authorization: any) => {
        !!authorization ? this.setState({authorization: {...authorization}}) : this.setState({authorization: null})
        StorageUtil.set(STORAGE_KEYS.AUTHORIZATION_DATA_KEY, authorization)
    }
    
    getAuthorization = () => {
        return this.state.authorization
    }

    reloadAuthentication = () => {
        const loginData = StorageUtil.get(STORAGE_KEYS.LOGIN_DATA_KEY, null)
        this.setLoginData({loginData: loginData})
        return loginData
    }

    isAuthorized = () => {
        return !!this.getAuthentication()
    }

    doLogin = async () => {
        try {
            const googleLoginHandler = await ReflectionUtil.getGoogleLoginHandler()
            await googleLoginHandler.accounts.id.initialize({
                client_id: EnvironmentUtil.get(ENVIRONEMNT_KEYS.GOOGLE_AUTHENTICATION_CLIENT_ID),
                callback: (res: any) => this._handleLogin(res),
            });
            googleLoginHandler.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed()) {
                    throw new Error(`Try to clear the cookies or try again later!`);
                }
                if (
                    notification.isSkippedMoment() ||
                    notification.isDismissedMoment()
                ) {
                    // console.log(`logged or dismissed`);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    doLogout = async () => {
        await this._handleLogout()
    }

    handleFailure = async (result: any) => {
        console.log(`Failure at login`);
        console.log(result);
        alert(result);
    };

    _handleLogin = async (googleData: any) => {
        const handleLoginResponse = await fetch(`${API_BASE_URL}/auth`, {
            method: `POST`,
            body: JSON.stringify({
                token: googleData.credential,
            }),
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": `*`,
                "Access-Control-Allow-Headers": `*`,
                "Access-Control-Expose-Headers": `*`,
                "Access-Control-Allow-Methods": `*`,
                "Access-Control-Allow-Credentials": `true`,
                "Referrer-Policy": `no-referrer`
            },
        })
        const onlyToken = handleLoginResponse?.headers?.get(AUTHORIZATION_HEADER_KEY)?.split(` `)[1]
        if (!!onlyToken) {
            this.setAuthorization(onlyToken);
            this.setAuthentication(await handleLoginResponse.json());
        }
    }
    
    _handleLogout = async () => {
        const res = await fetch(`${API_BASE_URL}/auth`, {
            method: `DELETE`,
            body: JSON.stringify({
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${this.getAuthorization()}`,
            }),
            headers: {
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": `*`,
                "Sec-Fetch-Dest": `${API_BASE_URL}`
            },
        });
        this.setAuthorization(null);
        this.setAuthentication(null);
    };
    
}

export const AuthenticationServiceProvider = () => new AuthenticationService()