import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../../assets/Images/Logo.jpg";
import LazyLoad from "react-lazyload";
import { registerUser } from "@/Redux/authSlice";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, successMsg } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation logic
    let valid = true;
    let newErrors = { name: "", email: "", password: "" };

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordPattern.test(password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        valid = false;
      }
    }

    setErrors(newErrors);

    if (valid) {
      dispatch(registerUser({ name, email, password }));
    }
  };

  // Display toast messages based on Redux state changes
  useEffect(() => {
    if (error) {
      toast.error(error); // Display error message using toast.error
    }
    if (successMsg) {
      toast.success(successMsg); // Display success message using toast.success
    }
  }, [error, successMsg]);

  return (
    <>
      <ToastContainer /> {/* Ensure ToastContainer is mounted */}
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
            className="bg-glass mt-10"
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
                  <h1 className="b text-3xl font-bold">Create a new account</h1>
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
                    <Label htmlFor="name">Name</Label>
                    <motion.div
                      animate={{
                        borderColor: isNameFocused ? "#4A90E2" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => setIsNameFocused(false)}
                        className={`${errors.name ? "border-red-500" : ""}`}
                      />
                    </motion.div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ x: 100 }}
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
                  <motion.div
                    className="space-y-2"
                    initial={{ x: -100 }}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="submit" className="animate-slide-up w-full">
                      {loading ? "Loading..." : "Sign Up"}
                    </Button>
                  </motion.div>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  <span className="mr-2">Already have an account?</span>
                  <Link to="/SignIn" className="underline underline-offset-4">
                    Sign In
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

export default SignUp;
