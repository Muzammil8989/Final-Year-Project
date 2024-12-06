import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Logo from "../../assets/Images/Logo.jpg";
import LazyLoad from "react-lazyload";
import "animate.css";
import "./Sign.css";
import { loginUser } from "@/Redux/authSlice";

const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, successMsg, token, roleAssigned } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedUserType = localStorage.getItem("rememberedUserType");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");

    if (tokenTimestamp) {
      const currentTime = Date.now();
      const expirationTime =
        parseInt(tokenTimestamp, 10) + TOKEN_EXPIRATION_TIME;

      if (currentTime > expirationTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
      }
    }

    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
    if (rememberedUserType) {
      setUserType(rememberedUserType);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;
    let newErrors = { email: "", password: "", userType: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (!userType) {
      newErrors.userType = "Please select user type";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedUserType", userType);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedUserType");
      }
      dispatch(loginUser({ email, password, role: userType }))
        .unwrap()
        .then((res) => {
          toast.success("You have successfully logged in.");

          localStorage.setItem("tokenTimestamp", Date.now());
          if (userType === "Candidate") {
            navigate("/Candidate");
          } else if (userType === "Recruiter") {
            navigate("/Hr");
          }
        })
        .catch((err) => {
          console.error(err);
          const errorMessage =
            err?.response?.data?.msg ||
            err?.msg ||
            "Failed to log in. Please try again.";
          toast.error(errorMessage);
        });
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto">
          <LazyLoad>
            <img
              src={Logo}
              alt="HR Image"
              className="animate__animated animate__backInDown z-10 mx-auto size-10 rounded-[25%]"
            />
          </LazyLoad>

          <motion.div
            className="bg-glass mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate__animated animate__fadeInDown">
              <motion.div
                className="w-full max-w-md space-y-6 rounded-md p-6 sm:p-8"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">Welcome Back</h1>
                  <p className="text-gray-400">
                    Enter your credentials to access your account.
                  </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <motion.div
                    className="space-y-2"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <motion.div
                      animate={{
                        borderColor: isEmailFocused ? "#4A90E2" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        className={`${errors.email ? "border-red-500" : ""}`}
                      />
                    </motion.div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </motion.div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">User Type</Label>
                    <motion.div
                      animate={{
                        borderColor: errors.userType ? "#E53E3E" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        variants={{
                          open: { opacity: 1, scaleY: 1 },
                          closed: { opacity: 0, scaleY: 0 },
                        }}
                        transition={{ duration: 0.2 }}
                        initial="closed"
                        animate="open"
                      >
                        <Select
                          onValueChange={(value) => setUserType(value)}
                          value={userType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select User" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Recruiter">Recruiter</SelectItem>
                            <SelectItem value="Candidate">Candidate</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </motion.div>
                    {errors.userType && (
                      <p className="text-sm text-red-500">{errors.userType}</p>
                    )}
                  </div>
                  <motion.div
                    className="space-y-2"
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <motion.div
                      className="relative"
                      animate={{
                        borderColor: isPasswordFocused ? "#4A90E2" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className={`animate-slide-up pr-10 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground focus:outline-none"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </motion.div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </motion.div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        id="remember"
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="focus:ring-3 focus:ring-primary-300 h-4 w-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-muted-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="submit" className="animate-slide-up w-full">
                      Sign In
                    </Button>
                  </motion.div>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  <span className="mr-2">Don’t have an account?</span>
                  <Link to="/SignUp" className="underline underline-offset-4">
                    Sign Up
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
