import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../provider/UserProvider";

function ProtectedRoute() {
	const { userContext, loading } = useContext(UserContext);
	console.log("in Protected Routes...", userContext);
	if (loading) {
		return <div>Loading session, please wait...</div>;
	}

	if (!userContext || Object.keys(userContext).length === 0) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
