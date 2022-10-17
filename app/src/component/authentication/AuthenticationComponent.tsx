import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { TOPBAR_DIMMENTONS } from '../topbar/TopbarComponent';
import { GoogleLoginComponent } from './GoogleLoginComponent';
import { LoggedUserDataComponent } from './LoggedUserDataComponent';


export const AuthenticationComponent = () => {
    const { styleService, authenticationService } = useContext<any>(AppContext)
    return (
        <div
            style={styleService.build({
                width: `${TOPBAR_DIMMENTONS}px`, 
                height: `${TOPBAR_DIMMENTONS}px`,
                padding: "0 0 0 0",
                flexDirection: "row",
                alignItems: "center",
            })}
        >
            {
                authenticationService.state.loginData ? (
                    <LoggedUserDataComponent></LoggedUserDataComponent>
                ) : (
                    <GoogleLoginComponent></GoogleLoginComponent>
                )
            }
        </div>
    );
}