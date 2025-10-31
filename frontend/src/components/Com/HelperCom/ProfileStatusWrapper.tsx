import React from 'react';

interface Props {
  loading: boolean;
  error?: string | null;
  profile: any;
  onRetry?: () => void;
  children: React.ReactNode;
}

const ProfileStatusWrapper: React.FC<Props> = ({ loading, error, profile, onRetry, children }) => {
  if (loading && !profile) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>Loading profile...</p>
      </div>
    )
  };

  if (error && !profile) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center text-center text-red-400">
        <p className="text-lg font-semibold">⚠️ {error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
          >
            Retry
          </button>
        )}
      </div>
    )
  };

  if (profile === null) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProfileStatusWrapper;
