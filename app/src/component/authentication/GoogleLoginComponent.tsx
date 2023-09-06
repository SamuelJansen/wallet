import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserCircle} from '@phosphor-icons/react'
import { ICON_SIZE } from '../../service/StyleService';


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
              size={ICON_SIZE}
              onClick={() => authenticationService.doLogin()}
              color={styleService.getMainButtonColor()}
            />
        </div>
    </div>
    
  );
};
