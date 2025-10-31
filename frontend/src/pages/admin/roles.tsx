import React from "react";

import Button from "@/components/ui/Button";
import ShowDetails from "@/components/ui/ShowDetails";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { RoleCatagories } from "@/config/RoleList";
import ManageUserRole from "@/components/Com/adminCom/Role/ManageUserRole";

const Roles = () => {
  return (
    <section className="mt-5 w-full flex flex-col  lg:flex-row items-center lg:items-start justify-start gap-4  rounded-lg p-6">
      {/* Left Panel: Roles Overview */}
      <div className="flex flex-col justify-start w-full lg:w-2/3 gap-4 items-center">
        <InteractiveCard
          width="100%"
          height="fit-content"
          className="flex flex-col gap-4 p-6"
          tailwindBgClass="bg-gray-800/30 backdrop-blur-md"
          lightSize={50}
        >
          <div className="w-full flex items-center justify-between gap-4">
            <h4 className="text-3xl  md:text-4xl font-extrabold text-white">
              Roles & Categories
            </h4>
            <Button
              title="+ Add New Role"
              handleClick={() => {}}
              othercss="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
            />
          </div>

          {/* Roles list */}
          <div className="w-full flex flex-col gap-3 mt-4">
            {["Admin", "Moderator", "Seller", "Buyer", "Ban"].map((e, idx) => (
              <ShowDetails key={idx} roleName={e} />
            ))}
          </div>
        </InteractiveCard>

        <div className="bg-gray-800/40 w-[98%] border border-white/80  rounded-xl p-6 backdrop-blur-md">
          <h4 className="text-2xl font-semibold text-white mb-4">
            Role Permissions
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RoleCatagories.map(({ role, perms }) => (
              <div
                key={role}
                className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
              >
                <h5 className="text-lg font-bold text-cyan-400 mb-2">{role}</h5>
                <ul className="text-gray-300 text-sm list-disc list-inside">
                  {perms.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------ */}
      {/* Role Section */}
      {/* ------------------------ */}
      <ManageUserRole />
    </section>
  );
};

export default Roles;
