import { HeaderLists } from "@/config/HeaderLists";
import Link from "next/link";
import React from "react";
import { FaArrowRightFromBracket, FaXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import type { MobileSideBarProps } from "@/types";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MobileSideBar: React.FC<MobileSideBarProps> = ({
  open,
  setOpen,
  items,
  icon,
  position,
  title,
  footer,
}) => {
  const pathname = usePathname();

  function toggleBtn() {
    return setOpen(!open);
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <motion.div
          className="fixed inset-0 bg-black z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={toggleBtn}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 ${position}-0 w-[260px] h-full z-50 shadow-xl 
        bg-gradient-to-b from-[#0b1a2a] via-[#102b44] to-[#15405c]
        flex flex-col justify-between`}
        initial={{ x: position === "right" ? "100%" : "-100%" }}
        animate={{ x: open ? 0 : position === "right" ? "100%" : "-100%" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <button
            onClick={toggleBtn}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaXmark size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-6 py-6">
          {items.map((item, idx) => {
            const isActive = pathname === item.route;
            return (
              <motion.div
                key={idx}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.route}
                  onClick={toggleBtn}
                  className={`block text-lg font-medium rounded-md px-3 py-2 transition-all
                    ${
                      isActive
                        ? "text-white bg-gradient-to-r from-[#00ff95] to-[#00d1ff] shadow-md"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/40"
                    }`}
                >
                  {icon && item.imgURL ? (
                    <>
                      <Image
                        src={item.imgURL}
                        alt={item.imgURL}
                        width={34}
                        fetchPriority="high"
                        height={34}
                        className={isActive ? "brightness-[3] invert-0" : ""}
                      />
                      <p className="text-16 font-semibold  ">
                        {item.label || ""}
                      </p>
                    </>
                  ) : (
                    <p>{item.label}</p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
          {footer || <p>© {new Date().getFullYear()} NFT Marketplace</p>}
        </div>
      </motion.div>
    </>
  );
};

export default MobileSideBar;
