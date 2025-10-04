import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import * as t from "../../types";
import FormInput from "./FormInput";
import Button from "../ui/Button";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { updateUserInfo } from "@/reducer/userSlice";

const AddUserName = ({
  setIsFirstTimeLogin,
  isFirstTimeLogin,
}: t.AddUserNameProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (name: string) => {
    if (name.length < 4) return "Username must be at least 4 characters";
    if (/\s/.test(name)) return "Username cannot contain spaces";
    if (/[^a-zA-Z0-9]/.test(name)) return "Username can only contain letters and numbers";
    return "";
  };

  const handleClick = () => {
    const validationError = validateUsername(userName);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (address) {
      dispatch(updateUserInfo({ address, name: userName }));
      setIsFirstTimeLogin(false);
    }
  };

  return (
    <Dialog
      open={isFirstTimeLogin}
      onClose={() => {}}
      className="relative z-50"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl transform transition-all duration-300">
          <Dialog.Title className="text-xl font-semibold text-white mb-4 text-center">
            Welcome 👋
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 text-sm mb-6 text-center">
            Please set a username to continue
          </Dialog.Description>

          <div className="flex flex-col gap-4 w-full">
            <FormInput
              label={"Your Username"}
              placeholder={"e.g. Xashadul"}
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setError("");
              }}
            />

            {/* Validation Error */}
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <Button
              title={"Save"}
              othercss={`py-3 px-2 w-full rounded-xl ${
                !!validateUsername(userName) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              handleClick={handleClick}
              loading={!!validateUsername(userName)}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddUserName;
