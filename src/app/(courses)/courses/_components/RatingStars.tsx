/* eslint-disable @typescript-eslint/no-explicit-any */

const RatingStars = ({ courseStarRatings }: any) => {
  return (
    <div className="flex justify-start items-center">
      <p className="mr-2 text-md text-base font-semibold text-yellow-400">
        {courseStarRatings ? courseStarRatings.toFixed(1) : "4.95"}
      </p>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 me-1 mb-1 ${
            i < Math.floor(courseStarRatings)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
    </div>
  );
}

export default RatingStars;