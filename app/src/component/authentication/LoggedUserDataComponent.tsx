import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { BORDER_WIDTH, TOPBAR_DIMMENTONS } from '../topbar/TopbarComponent';
import { StyleService } from '../../service/StyleService'
import { AuthenticationService } from '../../service/AuthenticationService'

export const LoggedUserDataComponent = () => {
  const { 
    styleService, 
    authenticationService
  } : {
    styleService: StyleService,
    authenticationService: AuthenticationService
  } = useContext<any>(AppContext)
  return (
    <div style={styleService.build({})}>
        <div 
          style={styleService.build({
            padding: "0 0 0 0",
            alignItems: "center",
            justifyContent: "center"
          })}
          onClick={() => authenticationService.doLogout()}
        >
            <img
              src={authenticationService.getUserPictureUrl()} 
              referrerPolicy={"no-referrer"} 
              style={styleService.build({
                  padding: "0 0 0 0",
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
