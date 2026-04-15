import { UserContext } from "./context";
import { useContext } from "react";

export default function UserDetails() {
    const user = useContext(UserContext);
    console.log(user);
    
    return (
        <div>
            <h2>User Details</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}