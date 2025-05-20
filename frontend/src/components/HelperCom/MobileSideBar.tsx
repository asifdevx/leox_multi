import { HeaderLists } from "@/config/HeaderLists";
import Link from "next/link";
import React from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { motion } from "framer-motion";
import type { MobileSideBar } from "@/types";


const MobileSideBar = ({ open, setOpen }: MobileSideBar) => {
  function toggleBtn() {
    return setOpen(!open);
  }
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black opacity-50 z-40 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={toggleBtn}
      />
      <motion.div
        className="fixed top-0 right-0 w-[250px] h-full bg-white z-50 shadow-lg"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={toggleBtn}
      >
        <div className="p-4 flex justify-between " onClick={toggleBtn}>
          <nav className="flex flex-col gap-4">
            {HeaderLists.map((item, idx) => (
              <Link
                key={idx}
                href={item.link || ""}
                className="text-lg font-ponomar"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div onClick={toggleBtn}>
            {" "}
            <FaArrowRightFromBracket size={24} />{" "}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileSideBar;
