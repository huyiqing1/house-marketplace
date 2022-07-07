import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, [])

    return (
        <div className="profile">
            {user ? <h1>{user.displayName}</h1> : "Not Logged In"}
        </div>
    );
}

export default Profile;