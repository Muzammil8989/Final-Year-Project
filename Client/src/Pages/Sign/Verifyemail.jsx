import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import "./Sign.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/verify/${token}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data.msg) {
        setLoading(false);
        setError(false);
        setMessage(response.data.msg);
      } else {
        setLoading(false);
        setError(true);
        setMessage("Unknown error occurred. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
      setMessage("Invalid verification token. Please try again.");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (error) {
        toast.error(message);
      } else if (message) {
        toast.success(message);
      }
    }
  }, [loading, error, message]);

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen items-center justify-center">
        <div className="bg-glass rounded-lg p-10 shadow-xl">
          <h2 className="mb-5 text-center text-3xl text-gray-900">
            Verification Status
          </h2>

          <p>
            {loading ? (
              <p className="text-center text-3xl text-gray-900">Verifying...</p>
            ) : (
              <div>
                {error ? (
                  <>
                    <p className="mb-4 text-center text-3xl text-red-500">
                      {message}
                    </p>
                    <Link to="/">
                      <Button
                        onClick={handleVerification}
                        variant="default"
                        size="sm"
                        className="mt-4 w-full"
                      >
                        {" "}
                        Go Back
                      </Button>
                    </Link>
                  </>
                ) : message ? (
                  <>
                    <p className="text-center text-3xl text-green-500">
                      {message}
                    </p>
                    <Link to="/SignIn">
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-4 w-full"
                      >
                        Login
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={handleVerification}
                    variant="default"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Verify Email
                  </Button>
                )}
              </div>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
