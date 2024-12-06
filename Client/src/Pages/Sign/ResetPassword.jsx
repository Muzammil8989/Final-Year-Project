import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import LazyLoad from "react-lazyload";
import Logo from "../../assets/Images/Logo.jpg";
import "./Sign.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(""); // Clear the error after showing the toast
    }
    if (successMsg) {
      toast.success(successMsg);
      setSuccessMsg(""); // Clear the success message after showing the toast
    }
  }, [error, successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { password: "", confirmPassword: "" };

    // Validate password
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

    // Validate confirmPassword
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:5001/api/resetPassword/${token}`,
        { password },
      );
      setSuccessMsg(data.msg);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
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
              alt="Logo"
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
                  <h1 className="text-3xl font-bold">Reset Password</h1>
                  <p className="text-gray-400">
                    Enter your new password to reset it.
                  </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                    className="space-y-2"
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <motion.div
                      className="relative"
                      animate={{
                        borderColor: isConfirmPasswordFocused
                          ? "#4A90E2"
                          : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setIsConfirmPasswordFocused(true)}
                        onBlur={() => setIsConfirmPasswordFocused(false)}
                        className={`animate-slide-up pr-10 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </motion.div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Reset Password"}
                  </Button>
                </form>
                {errors.form && (
                  <p className="text-center text-sm text-red-500">
                    {errors.form}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
