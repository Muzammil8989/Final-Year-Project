import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "../../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "flowbite-react";
import { FiLogOut, FiUser, FiMail, FiUserCheck } from "react-icons/fi"; // Importing icons

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

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
      <nav className="borer-none mr-40 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
              bordered
              className="h-10 w-10 rounded-full border border-white shadow-2xl"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="mr-48 rounded-md p-3 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #4431AF, #6A4ED2)" }}
          >
            <div>
              <div className="flex items-center space-x-2">
                <FiUser className="mr-2 text-xl text-white/80" />{" "}
                {/* User icon */}
                <h1 className="text-xl font-semibold text-white/80">
                  {user?.name}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="mr-2 text-xl text-white/70" />{" "}
                {/* Email icon */}
                <h5 className="text-base text-white/70">{user?.email}</h5>
              </div>
              <div className="flex items-center space-x-2">
                <FiUserCheck className="mr-2 text-xl text-white/70" />{" "}
                {/* Role icon */}
                <p className="text-base text-white/70">{user?.role}</p>
              </div>
            </div>
            <hr className="my-4 border-white/30" /> {/* Horizontal line */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center"
            >
              <FiLogOut className="mr-2" /> Logout {/* Logout icon */}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}

export default Navbar;
