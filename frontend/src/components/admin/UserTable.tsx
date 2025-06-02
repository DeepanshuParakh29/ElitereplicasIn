'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import { ADMIN_ENDPOINTS } from '@/config/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<{
          success: boolean;
          users: User[];
          message?: string;
        }>(ADMIN_ENDPOINTS.USERS);
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch users');
        }
        
        setUsers(data.users);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
              <td className="py-3 px-6 text-left">{user.name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-left">{user.role}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}>
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    {/* Edit Icon */}
                    ✏️
                  </button>
                  <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    {/* Delete Icon */}
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;