import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { TOBBAR_DIMMENTONS } from '../topbar/TopbarComponent';


export const LoggedUserDataComponent = () => {
  const { styleService, authenticationService } = useContext<any>(AppContext)
  return (
    <div style={styleService.build({})}>
        <div 
          style={styleService.build({
            alignItems: "center",
            justifyContent: "center"
          })}
          onClick={() => authenticationService.doLogout()}
        >
            <img
              src={authenticationService.state.loginData.picture} 
              referrerPolicy={"no-referrer"} 
              style={styleService.build({
                  width: `${TOBBAR_DIMMENTONS - TOBBAR_DIMMENTONS/4 - 1}px`, 
                  height: `${TOBBAR_DIMMENTONS - TOBBAR_DIMMENTONS/4 - 1}px`,
                  borderRadius: "50%",
                  border: `2.2px solid ${styleService.getColorMode().text}`,
                  borderColor: styleService.getColorMode().text
              })}
            />
        </div>
    </div>
  );
};
