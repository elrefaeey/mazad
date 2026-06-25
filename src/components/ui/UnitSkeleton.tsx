export const UnitSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image skeleton */}
        <div className="md:w-1/3">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Content skeleton */}
        <div className="md:w-2/3 space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="md:col-span-2 h-4 bg-gray-200 rounded w-48"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="flex gap-2">
              <div className="h-16 bg-gray-200 rounded w-20"></div>
              <div className="h-16 bg-gray-200 rounded w-20"></div>
              <div className="h-16 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};
