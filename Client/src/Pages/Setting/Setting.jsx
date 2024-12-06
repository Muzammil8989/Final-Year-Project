import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const Settings = ({ onSave }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const [avatarPreview, setAvatarPreview] = useState(null);

  const onSubmit = (data) => {
    onSave(data);
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-input").click();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center space-y-6 p-6">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          User Settings
        </h1>

        {/* Avatar Preview */}
        <div className="flex justify-center">
          <div onClick={handleAvatarClick} className="cursor-pointer">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="h-24 w-24 rounded-full border-2 border-gray-300"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500">
                No Avatar
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          {...register("avatar")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setValue("avatar", reader.result);
                setAvatarPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {errors.avatar && (
          <span className="text-sm text-red-500">{errors.avatar.message}</span>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Profile Settings
                </h2>
                {/* Name Field */}
                <motion.div
                  className="flex items-center rounded-lg bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaUser className="ml-3 text-lg text-gray-800" />
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                    className={`mt-1 block w-full border-0 bg-gray-100 p-3 transition focus:border-primary focus:outline-none focus:ring-0 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.name && (
                  <span className="text-sm text-red-500">
                    {errors.name.message}
                  </span>
                )}

                {/* Email Field */}
                <motion.div
                  className="flex items-center rounded-lg bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaEnvelope className="ml-3 text-lg text-gray-800" />
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className={`mt-1 block w-full border-0 bg-gray-100 p-3 transition focus:border-primary focus:outline-none focus:ring-0 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Update Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Update Password
                </h2>
                {/* Current Password */}
                <motion.div
                  className="flex items-center rounded-lg bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaLock className="ml-3 text-lg text-gray-800" />
                  <input
                    type="password"
                    placeholder="Current Password"
                    {...register("currentPassword", {
                      validate: (value) => {
                        const newPassword = watch("newPassword");
                        const confirmNewPassword = watch("confirmNewPassword");
                        if ((newPassword || confirmNewPassword) && !value) {
                          return "Current password is required";
                        }
                      },
                    })}
                    className={`mt-1 block w-full border-0 bg-gray-100 p-3 transition focus:border-primary focus:outline-none focus:ring-0 ${
                      errors.currentPassword ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.currentPassword && (
                  <span className="text-sm text-red-500">
                    {errors.currentPassword.message}
                  </span>
                )}

                {/* New Password */}
                <motion.div
                  className="flex items-center rounded-lg bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaLock className="ml-3 text-lg text-gray-800" />
                  <input
                    type="password"
                    placeholder="New Password"
                    {...register("newPassword", {
                      validate: (value) => {
                        const currentPassword = watch("currentPassword");
                        if (currentPassword && !value) {
                          return "New password is required";
                        }
                        if (value && value.length < 8) {
                          return "Password must be at least 8 characters";
                        }
                      },
                    })}
                    className={`mt-1 block w-full border-0 bg-gray-100 p-3 transition focus:border-primary focus:outline-none focus:ring-0 ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.newPassword && (
                  <span className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </span>
                )}

                {/* Confirm New Password */}
                <motion.div
                  className="flex items-center rounded-lg bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaLock className="ml-3 text-lg text-gray-800" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    {...register("confirmNewPassword", {
                      validate: (value) => {
                        const newPassword = watch("newPassword");
                        if (newPassword && value !== newPassword) {
                          return "Passwords do not match";
                        }
                      },
                    })}
                    className={`mt-1 block w-full border-0 bg-gray-100 p-3 transition focus:border-primary focus:outline-none focus:ring-0 ${
                      errors.confirmNewPassword ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.confirmNewPassword && (
                  <span className="text-sm text-red-500">
                    {errors.confirmNewPassword.message}
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <div className="mt-4 flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="hover:bg-primary-dark rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
