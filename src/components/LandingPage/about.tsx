import React from "react";
import AvatarCircles from "../magicui/avatar-circles";

const avatarUrls = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
];

const About = () => {
  return (
    <div className="flex justify-center items-center mx-auto max-w-7xl w-full h-full">
      <div className="flex flex-col space-y-8 w-full">
        {/* about bold text and subtext */}
        <div>
          <div className="font-bold tracking-tight text-zinc-900 dark:text-white text-center text-2xl">
            About
          </div>
          <p className="pt-4 text-base text-center text-zinc-700 dark:text-gray-200">
            Ride the Wave of Knowledge with
            <span className="text-blue-500"> Coursewave!</span> Where
            <br />
            Learning Meets Innovation!
          </p>
        </div>

        {/* vido and texts for small screen */}
        <div className="flex flex-col justify-start w-full md:place-items-center space-y-4 md:hidden">
          {/* video */}
          <div className="smooth-wrapper space-y-2">
            <video
              className="smooth-content h-[12rem] rounded-lg object-cover w-full md:w-[24rem] bg-blue-200"
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
            <div className="smooth-content ">
              <p className="font-semibold tracking-tight text-zinc-900 dark:text-gray-200 text-base">
                About Courewave
              </p>
              <p className="text-sm text-[#333333] dark:text-gray-200 opacity-80">
                2 min
              </p>
            </div>
          </div>

          {/* text and avatars */}
          <div className="w-9/12 space-y-1 ">
            <div className="text-left text-base text-md text-[#333333] dark:text-gray-200  w-9/12 ">
              Build a never-before skill set by taking our courses and interact
              with our extensive community! We have a great success with
              delivering high-quality, value-for-money content in our courses,
              and we take pride in our commitment to excellence in education.
              Our courses are meticulously designed to meet the diverse learning
              needs of our students, ensuring that each course offers
              substantial and practical knowledge that can be applied in
              real-world scenarios.
            </div>

            <div className="flex justify-start items-center space-x-4 w-9/12">
              <div className="flex items-start pt-8 justify-end flex-col w-full space-y-1">
                <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                <p className="text-[14px] text-zinc-800 dark:text-gray-200">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* video and texts for big screens */}
        <div className="hidden md:flex md:visible justify-center items-center space-x-8 mx-24">
          {/* video */}
          <div className="smooth-wrapper space-y-2">
            <video
              className="smooth-content h-[12rem] rounded-xl object-cover w-full md:w-[24rem] bg-blue-200"
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
            <div className="smooth-content ">
              <p className="font-semibold tracking-tight text-zinc-900 dark:text-gray-200 text-base">
                About Courewave
              </p>
              <p className="text-sm text-[#333333] dark:text-gray-200 opacity-80">
                2 min
              </p>
            </div>
          </div>

          {/* text and avatars */}
          <div className="w-9/12 space-y-1 ">
            {/* about text */}
            <div className="text-left text-base text-md text-[#333333] dark:text-gray-200 w-full opacity-80">
              Build a never-before skill set by taking our courses and interact
              with our extensive community! We have a great success with
              delivering high-quality, value-for-money content in our courses,
              and we take pride in our commitment to excellence in education.
              Our courses are meticulously designed to meet the diverse learning
              needs of our students, ensuring that each course offers
              substantial and practical knowledge that can be applied in
              real-world scenarios.
            </div>

            {/* avatars and happy customers text */}
            <div className="flex justify-start items-center space-x-4 w-9/12">
              <div className="flex items-start pt-8 justify-end flex-col w-full space-y-1">
                <AvatarCircles numPeople={200} avatarUrls={avatarUrls} />
                <p className="text-[14px] text-zinc-800 dark:text-gray-200 opacity-80">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
