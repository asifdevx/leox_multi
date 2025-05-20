import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import React from "react";
import clsx from "clsx";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

const people = [
  { id: 1, name: "sort" },
  { id: 2, name: "Wade Cooper" },
  { id: 3, name: "Tanya Fox" },
  { id: 4, name: "Arlene Mccoy" },
  { id: 5, name: "Devon Webb" },
];

export default function ListBox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <ListboxButton
        className={clsx(
          "w-full h-full text-center   px-3 py-1 bg-[#675e5e44]/30  border-[#a99a9a44] border-2 rounded-xl text-sm white-glassmorphism text-black flex gap-1 items-center justify-center",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
        )}
      >
        {selectedPerson.name}
        <span>
          <RiArrowDropDownLine className="text-2xl" />
        </span>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={clsx(
          "w-52 rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none ",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
        )}
      >
        {people.map((person) => (
          <ListboxOption
            key={person.name}
            value={person}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white"
          >
            <FaCheck className="invisible size-4 fill-black group-data-[selected]:visible" />
            <div className="text-sm/6 text-black">{person.name}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
