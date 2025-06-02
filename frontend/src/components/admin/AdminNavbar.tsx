import React from 'react';

interface AdminNavbarProps {
  title: string;
  // You can add more props here for page-specific navigation items if needed
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ title }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      {/* Add page-specific navigation items here if needed */}
      <div>
        {/* Example: Search bar or action buttons */}
      </div>
    </nav>
  );
};

export default AdminNavbar;