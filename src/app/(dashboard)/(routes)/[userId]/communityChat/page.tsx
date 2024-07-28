import AvatarCircles from "@/components/magicui/avatar-circles";
import useUserInfo from "@/hooks/use-user-info";
import Link from "next/link";
import React from "react";
import { MdSearch } from "react-icons/md";

const avatarUrls = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
];

const avatarUrls2 = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
];

const CommunityChat = ({
  params,
}: {
  params: {
    userId?: string;
  };
}) => {
  const userId = params?.userId!;

  return (
    <div className="md:mr-8 py-16 max-w-7xl overflow-x-hidden space-y-6">
      <div className="flex justify-between items-center pt-8">
        <p className="text-zinc-800 dark:text-white font-semibold tracking-tight text-xl">
          Communities
        </p>

        <div className="flex justify-center items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200 border border-stroke cursor-pointer">
          <MdSearch className="h-[1.2rem] w-[1.2rem] flex justify-center items-center" />
        </div>
      </div>

      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 ">
        <CommunityCard
          id={"community_clash_of_titans"}
          userId={userId}
          title={"Clash of Titans"}
          description={
            "Join top developers in Clash of Titans to conquer complex coding challenges together."
          }
          noOfPeopleOnline={24}
          avatarUrls={avatarUrls}
        />
        <CommunityCard
          id={"community_developers_den"}
          userId={userId}
          title={"Developer's Den"}
          description={
            "Developers Den: A collaborative haven for innovative minds to create and share code."
          }
          noOfPeopleOnline={13}
          avatarUrls={avatarUrls.toReversed()}
        />
        <CommunityCard
          id={"community_debugging_delemma"}
          userId={userId}
          title={"Debugging Delemma"}
          description={
            "Tackle tough bugs with peers in Debugging Dilemma, your ultimate troubleshooting support network."
          }
          noOfPeopleOnline={9}
          avatarUrls={avatarUrls2}
        />
        <CommunityCard
          id={"community_developers_den"}
          userId={userId}
          title={"Developer's Den"}
          description={
            "Developers Den: A collaborative haven for innovative minds to create and share code."
          }
          noOfPeopleOnline={13}
          avatarUrls={avatarUrls.toReversed()}
        />
        <CommunityCard
          id={"community_clash_of_titans"}
          userId={userId}
          title={"Clash of Titans"}
          description={
            "Join top developers in Clash of Titans to conquer complex coding challenges together."
          }
          noOfPeopleOnline={24}
          avatarUrls={avatarUrls}
        />
        <CommunityCard
          id={"community_developers_den"}
          userId={userId}
          title={"Developer's Den"}
          description={
            "Developers Den: A collaborative haven for innovative minds to create and share code."
          }
          noOfPeopleOnline={13}
          avatarUrls={avatarUrls.toReversed()}
        />
      </div>
    </div>
  );
};

export default CommunityChat;

const CommunityCard = ({
  id,
  userId,
  title,
  noOfPeopleOnline,
  description,
  avatarUrls,
}: any) => {
  return (
    <div className="p-4 rounded-xl border border-stroke space-y-2 hover:border-blue-700 hover:shadow-lg transition-all duration-100">
      <div className="flex flex-col justify-start items-start space-y-1">
        <AvatarCircles numPeople={200} avatarUrls={avatarUrls!} />
        <p className="text-lg font-semibold tracking-tighter line-clamp-1 text-ellipsis text-zinc-800 dark:text-white">
          {title ?? "Clash of Titans"}
        </p>
        <div className="flex justify-start items-center space-x-2">
          <p className="h-2 w-2 rounded-full bg-green-500"></p>
          <p className="text-xs">{noOfPeopleOnline ?? 11} online</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm line-clamp-3 text-ellipsis">
          {description ??
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil ut libero odit."}
        </p>
        <Link
          href={`/${userId}/communityChat/${id}`}
          className="px-4 py-2 flex justify-center items-center text-sm tracking-tight text-white bg-blue-500 rounded-[8px] cursor-pointer hover:bg-blue-700 transition-all duration-100"
        >
          Join now
        </Link>
      </div>
    </div>
  );
};
