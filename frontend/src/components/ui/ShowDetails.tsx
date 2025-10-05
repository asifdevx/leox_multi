// components/ui/ShowDetails.tsx
import { Disclosure } from "@headlessui/react";
import { useAccount } from "wagmi";
import { shortenAddress } from "./ShortenAddress";

interface ShowDetailsProps {
  roleName: string;
  userCount: number;
}

export default function ShowDetails({ roleName, userCount }: ShowDetailsProps) {
  const { address } = useAccount();

  return (
    <Disclosure as="div" className="bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <Disclosure.Button className="flex justify-between items-center w-full text-white font-medium text-lg">
        <span>{roleName}</span>
        <span className="text-gray-400">{userCount} Users</span>
      </Disclosure.Button>

      <Disclosure.Panel className="mt-3 p-3 bg-gray-700 rounded-lg text-gray-300">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <p>Name</p>
          <p>{address ? shortenAddress(address) : "No Address"}</p>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}
