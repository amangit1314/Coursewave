import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";
import { FaHandsClapping } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdMoreHoriz, MdReport } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, SquarePen, UserMinus, UserPlus } from "lucide-react";
// import { Blog, BlogComment } from "@prisma/client";

type BlogComment = {
  id: string;
  blogId: string;
  content: string;
  authorId: string;
  writtenOn: Date | null;
  editedOn: Date | null;
};

type BlogWithComments = {
  id: string;
  title: string;
  shortDescription: string | null;
  content: string;
  estimatedReadingTime: string;
  clapsCount: number;
  authorId: string;
  categoryName: string | null;
  comments: BlogComment[];
  thumbnailUrl: string | null;
  isRecommended: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const ArticleCard = ({ article }: {article: BlogWithComments}) => {
  return (
    <Link
      href={`/article/${article.id}`}
      className="space-y-2 w-full cursor-pointer"
    >
      <Image
        src={
          article.thumbnailUrl
            ? article.thumbnailUrl
            : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/223dd65e-75de-473f-b14d-dc462932ba27/d2pdac2-9dfeb816-99cc-4c5e-812e-0d79aa051ea7.png/v1/fit/w_828,h_518,q_70,strp/think_big_wallpaper_by_mrdanger96_d2pdac2-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvMjIzZGQ2NWUtNzVkZS00NzNmLWIxNGQtZGM0NjI5MzJiYTI3XC9kMnBkYWMyLTlkZmViODE2LTk5Y2MtNGM1ZS04MTJlLTBkNzlhYTA1MWVhNy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.tfVAxSPMMy8IqzDNIVoPaNF6tImy7l3I-yfF_1j10HY"
        }
        alt=""
        className="rounded-md h-[210px] w-full"
        height={210}
        width={480}
      />

      <div className="flex space-x-2 justify-start items-center">
        <p className="uppercase text-xs text-blue-500 font-medium">
          Getting Started
        </p>
        <div className="flex justify-start items-center space-x-1">
          <GoDotFill size={12} />
          <p className="text-xs uppercase">
            {article.estimatedReadingTime
              ? article.estimatedReadingTime
              : "6 min read"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-lg text-zinc-800 dark:text-white font-bold tracking-tight leading-1 line-clamp-2">
          {article.title
            ? article.title
            : "Elevate & Innovate: Design Trends for the Modern Aesthetic"}
        </p>
        <p className="text-sm dark:text-gray-300 line-clamp-2">
          {article.shortDescription ? (
            article.shortDescription.toString()
          ) : (
            `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt
          illo iusto molestias consectetur totam quod tenetur consequatur odio
          tempore in, facere officiis quidem iste voluptatem dicta, natus
          necessitatibus, voluptatum inventore.`
          )}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex px-1 space-x-4">
          <div className="flex justify-start items-center space-x-2  hover:text-zinc-900 dark:hover:text-blue-600">
            <FaHandsClapping size={18} />
            <p className="text-xs mt-1">
              {article.clapsCount ? article.clapsCount : 0}
            </p>
          </div>

          <div className="flex justify-start items-center space-x-2 hover:text-zinc-900 dark:hover:text-blue-600">
            <AiOutlineComment size={18} />
            <p className="text-xs mt-1">
              {article.comments && article.comments.length > 0 ? article.comments.length : 0}
            </p>
          </div>
        </div>

        <div className="flex px-1 space-x-4">
          {/* bookmark icons */}
          {/* <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900 dark:hover:text-blue-600">
            <CiBookmarkPlus size={18} />
          </div> */}

          {/* share */}
          <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-blue-500">
            <FaShareFromSquare size={18} />
          </div>

          {/* more */}
          {/* <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-zinc-900 dark:hover:text-blue-600">
            <MdMoreHoriz size={18} />
          </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-start items-center space-x-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-500">
                  <MdMoreHoriz size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer hover:text-green-500 dark:hover:text-green-400 ">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Show more from author</span>
                    <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>Show less from author</span>
                    <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-green-500 dark:hover:text-green-400 cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Follow Author</span>
                    <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Mute Author</span>
                    <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem className="text-red-500 dark:text-red-400 cursor-pointer">
                  <MdReport className="mr-2 h-4 w-4" />
                  <span>Report article</span>
                  <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </Link>
  );
};
