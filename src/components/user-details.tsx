import { UserContext } from "./context";
import { useContext } from "react";

export default function UserDetails() {
    const user = useContext(UserContext);

    return (
        <div className="text-white p-4">
            <h2 className="text-lg font-semibold mb-2">User Details</h2>
            <p className="text-sm text-gray-400">Name: {user.name}</p>
            <p className="text-sm text-gray-400">Email: {user.email}</p>
        </div>
    );
}