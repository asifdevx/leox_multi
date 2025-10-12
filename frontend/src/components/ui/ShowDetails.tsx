import { fetchUsersByRole } from "@/reducer/RoleByUserSlice";
import { Disclosure, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleCopy } from "../HelperCom/handleCopy";
import { AppDispatch, RootState } from "../store/store";
import { shortenAddress } from "./ShortenAddress";
import { GoCopy } from "react-icons/go";
import Image from "next/image";

interface ShowDetailsProps {
  roleName: string;
}

export default function ShowDetails({ roleName }: ShowDetailsProps) {
  const { loading, usersByRole } = useSelector(
    (state: RootState) => state.roleByUser
  );
  const users = usersByRole[roleName] || [];
  const dispatch = useDispatch<AppDispatch>();

  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    dispatch(fetchUsersByRole(roleName));
  }, [dispatch, roleName]);

  // Reset visible count if role changes
  useEffect(() => {
    setVisibleCount(1);
  }, [roleName]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 1);
  };

  // Skeleton/loading placeholder
  if (loading && users.length === 0) {
    return (
      <div className="bg-gray-900 animate-pulse p-5 rounded-xl shadow-md w-full">
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <div className="bg-gray-700/60 hover:bg-gray-700/80 rounded-lg shadow-sm transition-all">
          {/* Header */}
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 cursor-pointer text-white font-semibold text-lg md:text-xl transition-colors">
            <div className="flex items-center gap-3">
              <Image
                width={32}
                height={32}
                src={`/${roleName}.png`}
                alt={roleName}
                fetchPriority="high"
                className="rounded-full object-cover"
              />
              <span>{roleName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-blue-500">{users.length} Users</span>
              <span
                className={`transform transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </Disclosure.Button>

          {/* Panel */}
          <Transition
            show={open}
            enter="transition duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-200 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-4 py-3 bg-gray-700/80 rounded-b-lg text-gray-300">
              {users.length > 0 ? (
                <>
                  <ul className="flex flex-col divide-y divide-gray-600">
                    {users.slice(0, visibleCount).map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center py-2 text-sm sm:text-base hover:bg-gray-600/30 transition-colors rounded-md px-2"
                      >
                        <div className="text-base md:text-lg font-medium">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm md:text-base font-mono text-gray-200">
                            {shortenAddress(item.address)}
                          </span>
                          <GoCopy
                            className="text-white/60 cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleCopy(item.address)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  {visibleCount < users.length && (
                    <div className="mt-2 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400 italic">
                  No users found for this role.
                </p>
              )}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}
