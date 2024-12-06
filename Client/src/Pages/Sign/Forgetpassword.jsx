import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Logo from "../../assets/Images/Logo.jpg";
import LazyLoad from "react-lazyload";
import { forgetPassword } from "../../Redux/authSlice";

function Forgetpassword() {
  const dispatch = useDispatch();
  const { loading, error, successMsg } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (successMsg) {
      toast.success(successMsg);
      setEmail("");
    }
  }, [error, successMsg]);

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;
    let newErrors = { email: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    dispatch(forgetPassword({ email }));
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
                  <h1 className="text-3xl font-bold">Forget Password</h1>
                  <p className="text-gray-400">
                    Enter your email to reset your password.
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

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Forgetpassword;
