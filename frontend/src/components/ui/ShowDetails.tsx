import { fetchUsersByRole } from "@/reducer/RoleByUserSlice";
import { Disclosure, Transition } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { shortenAddress } from "../../utils/ShortenAddress";
import { GoCopy } from "react-icons/go";
import Image from "next/image";
import { handleCopy } from "@/utils/handleCopy";

interface ShowDetailsProps {
  roleName: string;
}

const CHUNK_SIZE = 10; // Load 10 users at a time

export default function ShowDetails({ roleName }: ShowDetailsProps) {
  const { loading, usersByRole } = useSelector(
    (state: RootState) => state.roleByUser
  );
  const users = usersByRole[roleName] || [];
  const dispatch = useDispatch<AppDispatch>();

  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

  // Fetch users only if not already loaded
  useEffect(() => {
    if (!usersByRole[roleName]) {
      dispatch(fetchUsersByRole(roleName));
    }
    setVisibleCount(CHUNK_SIZE); // Reset visible count when role changes
  }, [dispatch, roleName, usersByRole]);

  const visibleUsers = useMemo(() => users.slice(0, visibleCount), [users, visibleCount]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + CHUNK_SIZE);

  // Skeleton
  if (loading && users.length === 0) {
    return (
      <div className="bg-gray-900 animate-pulse p-5 rounded-xl shadow-md w-full">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <div className="bg-gray-700/60 hover:bg-gray-700/80 rounded-lg shadow-sm transition-all">
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 cursor-pointer text-white font-semibold text-lg md:text-xl transition-colors">
            <div className="flex items-center gap-3">
              <Image
                width={32}
                height={32}
                src={`/${roleName}.png`}
                alt={roleName}
                className="rounded-full object-cover"
                fetchPriority="high"
              />
              <span>{roleName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-blue-500">{users.length} Users</span>
              <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
          </Disclosure.Button>

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
                    {visibleUsers.map((item) => (
                      <li
                        key={item.address}
                        className="flex justify-between items-center py-2 text-sm sm:text-base hover:bg-gray-600/30 transition-colors rounded-md px-2"
                      >
                        <div className="text-base md:text-lg font-medium">{item.name}</div>
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
                <p className="text-gray-400 italic">No users found for this role.</p>
              )}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}
