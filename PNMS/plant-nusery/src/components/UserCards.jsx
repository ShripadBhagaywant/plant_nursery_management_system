import React, { useState } from 'react';
import { LockKeyOpen, UserCircle, X, LockKey } from '@phosphor-icons/react';

const UserCards = ({ users, onBlockToggle }) => {
  const [confirm, setConfirm] = useState({
    show: false,
    userId: null,
    isBlocked: false,
  });

  const handleConfirm = (userId, currentBlockedStatus) => {
    setConfirm({ show: true, userId, isBlocked: currentBlockedStatus });
  };

  const handleAction = () => {
    if (confirm.userId != null) {
      onBlockToggle(confirm.userId, confirm.isBlocked);
    }
    setConfirm({ show: false, userId: null, isBlocked: false });
  };

  const closeModal = () => {
    setConfirm({ show: false, userId: null, isBlocked: false });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user, idx) => {
        const isBlocked = user.is_blocked === true;

        return (
          <div
            key={user.id}
            className="bg-white border shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition hover:shadow-xl cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <UserCircle size={40} className="text-red-500  shadow-sm hover:shadow-xl cursor-pointer rounded-full " />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate max-w-[200px]">
                  {user.name}
                </h4>
                <p className="text-xs sm:text-sm text-green-500 truncate max-w-[220px]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-green-400">Role</span>
                <span className="text-xs sm:text-sm font-medium capitalize">{user.role}</span>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full shadow-lg hover:shadow-xl cursor-pointer ${
                    isBlocked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {isBlocked ? 'Blocked' : 'Active'}
                </span>
                <button
                    onClick={() => handleConfirm(user.id, isBlocked)}
                    title={isBlocked ? 'Unblock User' : 'Block User'}
                    aria-label={isBlocked ? 'Unblock User' : 'Block User'}
                    className={`
                      px-2 py-1 mt-3 ml-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium 
                      rounded-full border-lg shadow-lg hover:shadow-xl 
                      ${isBlocked 
                        ? 'border-green-500 text-green-600 hover:bg-green-100 focus:ring-green-400'
                        : 'border-red-500 text-red-500 hover:bg-red-100 focus:ring-red-400'
                      }
                    `}
                  >
                    {isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Confirmation Modal */}
      {confirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-xl shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 pr-8">
              {confirm.isBlocked ? 'Unblock User?' : 'Block User?'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to {confirm.isBlocked ? 'unblock' : 'block'} this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 rounded-md text-sm text-white ${
                  confirm.isBlocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirm.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCards;
