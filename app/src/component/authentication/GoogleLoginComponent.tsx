import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserCircle} from 'phosphor-react'
import { TOPBAR_DIMMENTONS } from '../topbar/TopbarComponent';


export const GoogleLoginComponent = () => {
  const { styleService, authenticationService } = useContext<any>(AppContext)
  return (
    <div style={styleService.build({})}>
        <div 
          style={styleService.build({
            padding: "0 0 0 0",
            alignItems: "center",
            justifyContent: "center"
          })}
          // onClick={() => authenticationService.doLogout()}
        >
            <UserCircle 
              size={TOPBAR_DIMMENTONS - TOPBAR_DIMMENTONS/8}
              onClick={() => authenticationService.doLogin()}
              color={styleService.getColorMode().text}
            />
        </div>
    </div>
    
  );
};
