import { Role } from "@/types";
import Button from "./Button";

// Define canonical role order
const allRoleList: Role[] = ["Admin", "Moderator", "Seller", "Buyer", "Ban"];

export const renderRoleButtons = (
  roles: Role[],
  filterFn: (role: Role) => boolean,
  icon: React.ReactNode,
  handleClick: (role: Role) => void,
  options?: {
    disableFn?: (role: Role) => boolean;
  }
) => {
  return allRoleList.filter(filterFn).map((role, idx) => {
    const isDisabled = options?.disableFn?.(role) ?? false;

    return (
      <Button
        key={idx}
        title={role}
        othercss={`${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 transition-transform"
        }`}
        icon={icon}
        iconClass="text-[14px] hover:text-[16px] transition-all"
        handleClick={() => {
          if (!isDisabled) handleClick(role);
        }}
      />
    );
  });
};
