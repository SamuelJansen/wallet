import { useContext } from 'react';
import { AppContext, AppContextProps } from '../../context/AppContext';
import { GoogleLoginComponent } from './GoogleLoginComponent';
import { LoggedUserDataComponent } from './LoggedUserDataComponent';
import { TOPBAR_DIMMENTONS } from '../../service/StyleService';


export const AuthenticationComponent = () => {
    const { styleService, authenticationService } = useContext<AppContextProps>(AppContext)
    return (
        <div
            style={styleService.build({
                width: `${TOPBAR_DIMMENTONS}px`, 
                height: `${TOPBAR_DIMMENTONS}px`,
                padding: "0 0 0 0",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
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