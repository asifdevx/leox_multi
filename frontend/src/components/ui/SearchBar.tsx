import { SearchBarProps } from "@/types";
import React from "react";
import Input from "./Input";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ search, setSearchBar }: SearchBarProps) => {
  return (
    <AnimatePresence>
      {search && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 py-5"
        >
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <Input
              placeholder="Search your NFTs"
              type="text"
              inputClass="flex-1 bg-[#e8eeee] rounded-lg px-3 py-2"
              icon={
                <HiOutlineMagnifyingGlass
                  size={22}
                  className="text-[#7a5454]"
                />
              }
            />
            <button
              onClick={() => setSearchBar(false)}
              className="p-2 rounded-full hover:bg-[#f2f2f2] transition-colors"
              aria-label="Close search"
            >
              <IoMdClose size={22} className="text-[#292b2b]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
