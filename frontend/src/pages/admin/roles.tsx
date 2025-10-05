// pages/Roles.tsx
import Button from '@/components/ui/Button';
import ShowDetails from '@/components/ui/ShowDetails';
import React from 'react';

const Roles = () => {
  return (
    <section className="section">
      <div className="inner_section">
        {/* Header */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Roles & Categories
          </h1>
        <div className="flex items-center justify-center md:justify-end">
          <Button
            title="+ Add New Role"
            handleClick={() => {}}
            othercss="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
          />
        </div>

        {/* Roles list */}
        <div className="w-full flex flex-col gap-3">
          <ShowDetails roleName="Admin" userCount={5} />
          <ShowDetails roleName="Editor" userCount={12} />
          <ShowDetails roleName="Viewer" userCount={20} />
          {/* Add more roles here */}
        </div>
      </div>

      <div className="inner_section">
        {/* Header */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Roles & Categories
          </h1>
        <div className="flex items-center justify-center md:justify-end">
          <Button
            title="+ Add New Role"
            handleClick={() => {}}
            othercss="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
          />
        </div>

        {/* Roles list */}
        <div className="w-full flex flex-col gap-3">
          <ShowDetails roleName="Admin" userCount={5} />
          <ShowDetails roleName="Editor" userCount={12} />
          <ShowDetails roleName="Viewer" userCount={20} />
          {/* Add more roles here */}
        </div>
      </div>
    </section>
  );
};

export default Roles;
