import AvatarCircles from "@/components/magicui/avatar-circles";
import React from "react";
// import AvatarCircles from "../magicui/avatar-circles";

const avatarUrls = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
];

const About = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
      <div className="flex w-full flex-col space-y-8 md:px-0">
        {/* about bold text and subtext */}
        <div>
          <div className="text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            About
          </div>
          <p className="pt-4 text-center text-base text-zinc-700 dark:text-gray-200">
            Ride the Wave of Knowledge with
            <span className="text-blue-500"> Coursewave!</span> Where
            <br />
            Learning Meets Innovation!
          </p>
        </div>

        {/* for mobile screens */}
        <div className="visible md:hidden">
          {/* vido and texts for small screen */}
          <div className="flex w-full flex-col justify-start space-y-4 md:hidden md:place-items-center">
            {/* video */}
            <div className="smooth-wrapper space-y-2">
              {/* texts */}
              <div className="flex  justify-between items-center mx-auto">
                <h3 className="dark:text-white font-semibold tracking-tight text-zinc-800">
                  About Courewave
                </h3>
                <p className="text-sm text-[#333333] opacity-80 dark:text-gray-200">
                  2 min
                </p>
              </div>

              {/* video */}
              <video
                className="smooth-content max-w-screen mb-4 h-[12rem] w-full rounded-xl overflow-hidden bg-blue-200 object-cover md:w-[24rem]"
                width="384"
                height="192"
                loop
                autoPlay
              >
                <source
                  className="bg-cover"
                  src="assets/videos/vid.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            {/* text and avatars */}
            <div className="w-full space-y-4">
              {/* text */}
              <div className="text-md w-full text-left text-base text-zinc-700 dark:text-gray-200">
                Build a never-before skill set by taking our courses and
                interact with our extensive community! We have a great success
                with delivering high-quality, value-for-money content in our
                courses, and we take pride in our commitment to excellence in
                education. Our courses are meticulously designed to meet the
                diverse learning needs of our students, ensuring that each
                course offers substantial and practical knowledge that can be
                applied in real-world scenarios.
              </div>

              {/* avatar */}
              <div className="flex w-full flex-col items-start justify-end space-y-1 md:w-9/12">
                <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                <p className="text-[14px] text-zinc-800 dark:text-gray-200">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* video and texts for big screens */}
          <div className="mx-24 hidden items-center justify-center space-x-8 md:visible md:flex">
            {/* video */}
            <div className="smooth-wrapper space-y-2">
              <video
                className="smooth-content h-[12rem] w-full rounded-xl bg-blue-200 object-cover md:w-[24rem]"
                width="384"
                height="192"
                loop
                autoPlay
              >
                <source
                  className="bg-cover"
                  src="assets/videos/vid.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="smooth-content">
                <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-gray-200">
                  About Courewave
                </p>
                <p className="text-sm text-[#333333] opacity-80 dark:text-gray-200">
                  2 min
                </p>
              </div>
            </div>

            {/* text and avatars */}
            <div className="w-9/12 space-y-1">
              {/* about text */}
              <div className="text-md w-full text-left text-base text-[#333333] opacity-80 dark:text-gray-200">
                Build a never-before skill set by taking our courses and
                interact with our extensive community! We have a great success
                with delivering high-quality, value-for-money content in our
                courses, and we take pride in our commitment to excellence in
                education. Our courses are meticulously designed to meet the
                diverse learning needs of our students, ensuring that each
                course offers substantial and practical knowledge that can be
                applied in real-world scenarios.
              </div>

              {/* avatars and happy customers text */}
              <div className="flex w-9/12 items-center justify-start space-x-4">
                <div className="flex w-full flex-col items-start justify-end space-y-1 pt-8">
                  <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                  <p className="text-[14px] text-zinc-800 opacity-80 dark:text-gray-200">
                    Happy Customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* for big screens */}
        <div className="hidden md:visible md:flex">
          {/* vido and texts for small screen */}
          <div className="flex w-full flex-col justify-start space-y-4 md:hidden md:place-items-center">
            {/* video */}
            <div className="smooth-wrapper space-y-2">
              <video
                className="smooth-content h-[12rem] w-full rounded-lg bg-blue-200 object-cover md:w-[24rem]"
                width="384"
                height="192"
                loop
                autoPlay
              >
                <source
                  className="bg-cover"
                  src="assets/videos/vid.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="smooth-content">
                <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-gray-200">
                  About Courewave
                </p>
                <p className="text-sm text-[#333333] opacity-80 dark:text-gray-200">
                  2 min
                </p>
              </div>
            </div>

            {/* text and avatars */}
            <div className="w-9/12 space-y-4">
              {/* text */}
              <div className="text-md w-9/12 text-left text-base text-zinc-700 dark:text-gray-200">
                Build a never-before skill set by taking our courses and
                interact with our extensive community! We have a great success
                with delivering high-quality, value-for-money content in our
                courses, and we take pride in our commitment to excellence in
                education. Our courses are meticulously designed to meet the
                diverse learning needs of our students, ensuring that each
                course offers substantial and practical knowledge that can be
                applied in real-world scenarios.
              </div>

              {/* avatar */}
              <div className="flex w-full flex-col items-start justify-end space-y-1 md:w-9/12">
                <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                <p className="text-[14px] text-zinc-800 dark:text-gray-200">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* video and texts for big screens */}
          <div className="mx-24 hidden items-center justify-center space-x-8 md:visible md:flex">
            {/* video */}
            <div className="smooth-wrapper space-y-2">
              <video
                className="smooth-content h-[12rem] w-full rounded-xl bg-blue-200 object-cover md:w-[24rem]"
                width="384"
                height="192"
                loop
                autoPlay
              >
                <source
                  className="bg-cover"
                  src="assets/videos/vid.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="smooth-content">
                <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-gray-200">
                  About Courewave
                </p>
                <p className="text-sm text-[#333333] opacity-80 dark:text-gray-200">
                  2 min
                </p>
              </div>
            </div>

            {/* text and avatars */}
            <div className="w-9/12 space-y-1">
              {/* about text */}
              <div className="text-md w-full text-left text-base text-[#333333] opacity-80 dark:text-gray-200">
                Build a never-before skill set by taking our courses and
                interact with our extensive community! We have a great success
                with delivering high-quality, value-for-money content in our
                courses, and we take pride in our commitment to excellence in
                education. Our courses are meticulously designed to meet the
                diverse learning needs of our students, ensuring that each
                course offers substantial and practical knowledge that can be
                applied in real-world scenarios.
              </div>

              {/* avatars and happy customers text */}
              <div className="flex w-9/12 items-center justify-start space-x-4">
                <div className="flex w-full flex-col items-start justify-end space-y-1 pt-8">
                  <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                  <p className="text-[14px] text-zinc-800 opacity-80 dark:text-gray-200">
                    Happy Customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
