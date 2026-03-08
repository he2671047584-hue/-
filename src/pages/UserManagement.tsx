
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { LoaderIcon, UserIcon, LogOutIcon } from '../components/ui/icons';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('无法获取用户列表');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除该用户吗？此操作不可恢复。')) return;

    try {
      await api.deleteUser(id);
      // 成功后刷新列表
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('删除失败');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-tcm-900 mb-2">用户管理</h1>
          <p className="text-tcm-600">管理平台注册用户及其权限。</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium border border-orange-200">
          管理员模式
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-tcm-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center text-tcm-500 gap-2">
            <LoaderIcon className="animate-spin w-5 h-5" />
            <span>加载用户数据...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-tcm-50 border-b border-tcm-200 text-tcm-700 text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium">用户信息</th>
                  <th className="p-6 font-medium">角色</th>
                  <th className="p-6 font-medium">注册时间</th>
                  <th className="p-6 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tcm-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tcm-100 flex items-center justify-center text-tcm-600">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-tcm-900">{user.username}</p>
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-500">
                      {user.registeredAt || '刚刚'}
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser.id} // 不能删除自己
                        className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'
                            : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {user.id === currentUser.id ? '当前用户' : '删除'}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                   <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-400">暂无用户数据</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
