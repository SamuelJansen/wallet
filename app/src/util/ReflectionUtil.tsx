declare var window: any;

const getGoogleLoginHandler = async () => {
    let googleLoginHandler = await window.google  
    return googleLoginHandler
}

export const ReflectionUtil = {
    getGoogleLoginHandler
}