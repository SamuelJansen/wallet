import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { BORDER_WIDTH, TOPBAR_DIMMENTONS } from '../topbar/TopbarComponent';


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
                  width: `${TOPBAR_DIMMENTONS - TOPBAR_DIMMENTONS/4 - 1}px`, 
                  height: `${TOPBAR_DIMMENTONS - TOPBAR_DIMMENTONS/4 - 1}px`,
                  borderRadius: "50%",
                  border: `${BORDER_WIDTH}px solid ${styleService.getBorderColor()}`,
                  borderColor: styleService.getColorMode().text
              })}
            />
        </div>
    </div>
  );
};
