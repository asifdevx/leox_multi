import { Role } from "@/types";
import Button from "./Button";

// Define canonical role order
const allRoleList: Role[] = ["Admin", "Moderator", "Seller", "Buyer", "Ban"];
const roleColors: Record<Role, string> = {
  Admin: "bg-blue-600 hover:bg-blue-500",
  Moderator: "bg-purple hover:bg-purple-500",
  Seller: "bg-green-600 hover:bg-green-500",
  Buyer: "bg-yellow-600 hover:bg-yellow-500",
  Ban: "bg-red-600 hover:bg-red-500",
};
export const renderRoleButtons = (
  roles: Role[],
  filterFn: (role: Role) => boolean,
  icon: React.ReactNode,
  handleClick: (role: Role) => void,
  options?: {
    disableFn?: (role: Role) => boolean;
  }
) => {
  return allRoleList.filter(filterFn).map((role, idx) => (
    <Button
      key={idx}
      title={role}
      othercss={`${roleColors[role]} ${options?.disableFn?.(role) ? "opacity-50 cursor-not-allowed" : ""}`}
      icon={icon}
      iconClass="text-[14px] hover:text-[16px]"
      handleClick={() => {
        if (!options?.disableFn?.(role)) handleClick(role);
      }}
    />
  ));
};
