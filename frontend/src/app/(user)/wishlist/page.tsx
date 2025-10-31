// "use client";

// import React from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { dmSans } from "@/lib/config/fonts";
// import { cn } from "@/lib/utils/utils";
// import {
//   Heart,
//   Clock,
//   Users,
//   Star,
//   ShoppingCart,
//   Trash2,
//   BookOpen,
//   Zap,
// } from "lucide-react";

// // Hooks
// import {
//   useWishlist,
//   useRemoveFromWishlist,
//   useClearWishlist,
//   useWishlistCount,
// } from "@/hooks/useWishlist";
// import { useCart, useAddToCart } from "@/hooks/useCart";

// const WishlistPage: React.FC = () => {
//   // Wishlist hooks
//   const { data: wishlist = [], isLoading, isError } = useWishlist();
//   const { mutate: removeFromWishlist, isPending: removing } =
//     useRemoveFromWishlist();
//   const { mutate: clearWishlist } = useClearWishlist();
//   const { data: wishlistCount } = useWishlistCount();

//   // Cart hooks for in-cart status & add to cart
//   const { data: cart } = useCart();
//   const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

//   // Utility to check if course is in cart
//   const isInCart = (courseId: string) =>
//     cart?.CartItem?.some((item: any) => item.courseId === courseId);

//   // "Move All to Cart" logic
//   const moveAllToCart = () => {
//     wishlist.forEach((course) => {
//       if (!isInCart(course.id)) addToCart(course.id);
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-[300px] flex items-center justify-center">
//         Loading wishlist…
//       </div>
//     );
//   }
//   if (isError) {
//     return (
//       <div className="min-h-[300px] flex items-center justify-center text-red-500">
//         Failed to load wishlist.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <Button
//               onClick={() => window.history.back()}
//               variant="ghost"
//               className="absolute left-4 top-4"
//             >
//               ← Back
//             </Button>
//             <div>
//               <h1
//                 className={cn(
//                   "text-4xl font-bold text-gray-900 dark:text-white mb-2",
//                   dmSans.className
//                 )}
//               >
//                 My Wishlist
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {wishlistCount ?? wishlist.length}{" "}
//                 {wishlist.length === 1 ? "course" : "courses"} saved for later
//               </p>
//             </div>
//             {wishlist.length > 0 && (
//               <Button
//                 onClick={moveAllToCart}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 Add All to Cart
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Wishlist Items */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {wishlist.map((item) => (
//             <Card
//               key={item.id}
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-zinc-800 overflow-hidden group"
//             >
//               <CardContent className="p-0">
//                 {/* Course Image */}
//                 <div className="relative h-48 overflow-hidden">
//                   <Image
//                     src={item.imageUrl || "/placeholder_course.jpg"}
//                     alt={item.title}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                   {/* Discount Badge (optional, if your backend sends it) */}
//                   {/* {item.discount && (
//                     <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
//                       {item.discount}% OFF
//                     </Badge>
//                   )} */}

//                   {/* Action Buttons */}
//                   <div className="absolute top-3 right-3 flex gap-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeFromWishlist(item.id)}
//                       className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 backdrop-blur-sm"
//                       disabled={removing}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => addToCart(item.id)}
//                       className={cn(
//                         "h-8 w-8 backdrop-blur-sm",
//                         isInCart(item.id)
//                           ? "bg-green-500 hover:bg-green-600 text-white"
//                           : "bg-white/90 hover:bg-white text-gray-700"
//                       )}
//                       disabled={isInCart(item.id) || addingToCart}
//                       aria-label="Add to Cart"
//                     >
//                       <Heart
//                         className={cn(
//                           "h-4 w-4",
//                           isInCart(item.id) && "fill-white"
//                         )}
//                       />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Course Content */}
//                 <div className="p-6">
//                   <div className="mb-3">
//                     <h3
//                       className={cn(
//                         "font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2",
//                         dmSans.className
//                       )}
//                     >
//                       {item.title}
//                     </h3>
//                     <p className="text-gray-600 dark:text-gray-400 text-sm">
//                       By {item.instructor?.user.name || "Unknown Instructor"}
//                     </p>
//                   </div>

//                   {/* Course Stats */}
//                   {/* Customize these below to your API/DB */}
//                   <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{item.duration}</span>
//                     </div>
//                     {/* <div className="flex items-center gap-1">
//                       <Users className="h-4 w-4" />
//                       <span>{item.students?.toLocaleString()}</span>
//                     </div> */}
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>{item.averageRating}</span>
//                     </div>
//                   </div>

//                   {/* {item.level && (
//                     <Badge
//                       variant="secondary"
//                       className={cn(
//                         "mb-4",
//                         item.level === "Beginner" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
//                         item.level === "Intermediate" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
//                         item.level === "Advanced" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
//                       )}
//                     >
//                       {item.level}
//                     </Badge>
//                   )} */}

//                   {/* Price and Action */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={cn(
//                           "text-xl font-bold text-gray-900 dark:text-white",
//                           dmSans.className
//                         )}
//                       >
//                         ${item.dealPrice || item.price}
//                       </span>
//                       {item.price && (
//                         <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
//                           ${item.price}
//                         </span>
//                       )}
//                     </div>

//                     <Button
//                       onClick={() => addToCart(item.id)}
//                       className={cn(
//                         "whitespace-nowrap",
//                         isInCart(item.id)
//                           ? "bg-green-600 hover:bg-green-700 text-white"
//                           : "bg-blue-600 hover:bg-blue-700 text-white"
//                       )}
//                       disabled={isInCart(item.id) || addingToCart}
//                     >
//                       {isInCart(item.id) ? (
//                         <>
//                           <ShoppingCart className="h-4 w-4 mr-2" />
//                           In Cart
//                         </>
//                       ) : (
//                         <>
//                           <Zap className="h-4 w-4 mr-2" />
//                           Add to Cart
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Empty State */}
//         {wishlist.length === 0 && (
//           <Card className="border-0 shadow-lg dark:bg-zinc-800 text-center py-16 max-w-2xl mx-auto mt-12">
//             <CardContent>
//               <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Heart className="h-12 w-12 text-red-400" fill="currentColor" />
//               </div>
//               <h3
//                 className={cn(
//                   "text-2xl font-bold text-gray-900 dark:text-white mb-3",
//                   dmSans.className
//                 )}
//               >
//                 Your wishlist is empty
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
//                 Start building your learning journey! Save courses you're
//                 interested in and come back to them later.
//               </p>
//               <div className="flex gap-4 justify-center">
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//                   Browse Courses
//                 </Button>
//                 <Button variant="outline">View Recommendations</Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Recommendations Section */}
//         {/* !TODO: ...add recommendation logic here as desired... */}
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;

/// =====================================================================================

"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import {
  Heart,
  Clock,
  Star,
  ShoppingCart,
  Trash2,
  Zap,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

// Hooks
import {
  useWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
  useWishlistCount,
} from "@/hooks/useWishlist";
import { useCart, useAddToCart } from "@/hooks/useCart";

const WishlistPage: React.FC = () => {
  // Wishlist hooks
  const { data: wishlist = [], isLoading, isError } = useWishlist();
  const { mutate: removeFromWishlist, isPending: removing } =
    useRemoveFromWishlist();
  const { mutate: clearWishlist } = useClearWishlist();
  const { data: wishlistCount } = useWishlistCount();

  // Cart hooks for in-cart status & add to cart
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  // Utility to check if course is in cart
  const isInCart = (courseId: string) =>
    cart?.CartItem?.some((item: any) => item.courseId === courseId);

  // "Move All to Cart" logic
  const moveAllToCart = () => {
    wishlist.forEach((course) => {
      if (!isInCart(course.id)) addToCart(course.id);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Failed to load wishlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 px-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative">
          <div className="flex items-center justify-start gap-4">
            {/* Back Button */}
            <Link href="/browse" className="cursor-pointer">
              <Button
                variant="ghost"
                size="sm"
                className="group relative h-11 w-11 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <IoMdArrowRoundBack className="relative h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="sr-only">Back to browse</span>
              </Button>
            </Link>

            {/* Title & Count */}
            <div className="flex flex-row justify-start items-center space-x-2 text-center">
              <div className="inline-flex items-center gap-2">
                <h1
                  className={cn(
                    "text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent",
                    dmSans.className
                  )}
                >
                  Wishlist
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {wishlistCount ?? wishlist.length}
                  </span>
                  <span>
                    {wishlist.length === 1 ? "course" : "courses"}
                  </span>
                </span>
              </p>
            </div>
          </div>

          {/* Add All to Cart Button */}
          {wishlist.length > 0 && (
            <Button
              onClick={moveAllToCart}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Add All to Cart
            </Button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <Card
              key={item.id}
              className="border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-[1.02]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-0">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.imageUrl || "/placeholder_course.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {(item.discount ?? 0) > 0 && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold">
                      <Zap className="w-3 h-3 mr-1" />
                      {item.discount ?? 0}% OFF
                    </Badge>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-white text-xs font-semibold">
                      Bestseller
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-red-500 backdrop-blur-sm hover:scale-110 transition-all"
                      disabled={removing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3
                      className={cn(
                        "font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                        dmSans.className
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {item.instructor?.user.name?.charAt(0) || "?"}
                      </div>
                      By {item.instructor?.user.name || "Unknown Instructor"}
                    </p>
                  </div>

                  {/* Course Stats */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {item.duration && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          {item.duration} min
                        </span>
                      </div>
                    )}
                    {item.averageRating && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                          {item.averageRating}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                        Trending
                      </span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent",
                          dmSans.className
                        )}
                      >
                        ${item.dealPrice || item.price}
                      </span>
                      {item.price && item.dealPrice && (
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                          ${item.price}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => addToCart(item.id)}
                      className={cn(
                        "whitespace-nowrap rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden group/btn",
                        isInCart(item.id)
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      )}
                      disabled={isInCart(item.id) || addingToCart}
                    >
                      {isInCart(item.id) ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <Card className="border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl text-center py-20 max-w-2xl mx-auto mt-12">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-950 dark:to-pink-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-12 w-12 text-red-500" fill="currentColor" />
              </div>
              <h3
                className={cn(
                  "text-2xl font-bold text-gray-900 dark:text-white mb-3",
                  dmSans.className
                )}
              >
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start building your learning journey! Save courses you're
                interested in and come back to them later.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Browse Courses
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all hover:scale-105 px-8 py-6 text-lg font-semibold"
                >
                  View Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;