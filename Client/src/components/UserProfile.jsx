import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/SignIn");
    } else {
      dispatch(loadUser());
    }
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/SignIn");
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && (
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <Button variant="outline" onClick={handleLogout}>
            Logout{" "}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
