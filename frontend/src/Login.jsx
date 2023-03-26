import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

export default function Login() {
    const { route } = useAuthenticator((context) => [context.route]);


    // const [token, setToken] = useState("");
    //   useEffect(() => {
    //     (async () => {
    //         const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
    //         setToken(token);
    //     })();
    //   }, []);



    if (route == "idle") {
        return <></>;
    }

    if (route == "authenticated") {
        return <Navigate to="/" />;
    }

//   return <Authenticator signUpAttributes={["email"]} />;
    return (
        <div className="mt-8">
            <Authenticator signUpAttributes={["email"]} />;
        </div>
    );
}