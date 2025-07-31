"use client";

import AvatarCircles from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { MdSearch, MdFilterList, MdAdd, MdTrendingUp, MdPeople, MdStar, MdGridOn, MdViewList } from "react-icons/md";
import { motion } from "framer-motion";

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

interface Community {
  id: string;
  title: string;
  description: string;
  noOfPeopleOnline: number;
  totalMembers: number;
  avatarUrls: string[];
  category: string;
  isTrending?: boolean;
  isPopular?: boolean;
  lastActivity?: string;
  tags: string[];
}

const communities: Community[] = [
  {
    id: "community_clash_of_titans",
    title: "Clash of Titans",
    description: "Join top developers in Clash of Titans to conquer complex coding challenges together. Share your expertise and learn from the best in the industry.",
    noOfPeopleOnline: 24,
    totalMembers: 1247,
    avatarUrls: avatarUrls,
    category: "Development",
    isTrending: true,
    lastActivity: "2 min ago",
    tags: ["JavaScript", "React", "Node.js"]
  },
  {
    id: "community_developers_den",
    title: "Developer's Den",
    description: "Developers Den: A collaborative haven for innovative minds to create and share code. Perfect for both beginners and experienced developers.",
    noOfPeopleOnline: 13,
    totalMembers: 892,
    avatarUrls: avatarUrls.toReversed(),
    category: "Development",
    isPopular: true,
    lastActivity: "5 min ago",
    tags: ["Python", "Django", "AI"]
  },
  {
    id: "community_debugging_delemma",
    title: "Debugging Dilemma",
    description: "Tackle tough bugs with peers in Debugging Dilemma, your ultimate troubleshooting support network. Get help when you're stuck!",
    noOfPeopleOnline: 9,
    totalMembers: 567,
    avatarUrls: avatarUrls2,
    category: "Support",
    lastActivity: "10 min ago",
    tags: ["Debugging", "Troubleshooting", "Help"]
  },
  {
    id: "community_ai_enthusiasts",
    title: "AI Enthusiasts",
    description: "Explore the future of artificial intelligence with fellow enthusiasts. Discuss latest AI trends, models, and applications.",
    noOfPeopleOnline: 31,
    totalMembers: 2156,
    avatarUrls: avatarUrls,
    category: "AI/ML",
    isTrending: true,
    isPopular: true,
    lastActivity: "1 min ago",
    tags: ["Machine Learning", "Deep Learning", "Neural Networks"]
  },
  {
    id: "community_web_designers",
    title: "Web Designers Hub",
    description: "A creative space for web designers to share inspiration, discuss design trends, and collaborate on projects.",
    noOfPeopleOnline: 18,
    totalMembers: 743,
    avatarUrls: avatarUrls2,
    category: "Design",
    lastActivity: "8 min ago",
    tags: ["UI/UX", "Design", "Creativity"]
  },
  {
    id: "community_startup_founders",
    title: "Startup Founders",
    description: "Connect with fellow entrepreneurs, share startup experiences, and get advice from successful founders.",
    noOfPeopleOnline: 22,
    totalMembers: 1341,
    avatarUrls: avatarUrls,
    category: "Business",
    isPopular: true,
    lastActivity: "3 min ago",
    tags: ["Entrepreneurship", "Startups", "Business"]
  }
];

const CommunityChat = ({
  params,
}: {
  params: {
    userId?: string;
  };
}) => {
  const userId = params?.userId!;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      const matchesSearch = community.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || community.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ["all", ...Array.from(new Set(communities.map(c => c.category)))];

  return (
    <div className="max-w-7xl space-y-6 overflow-x-hidden pb-16 md:mx-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
            Communities
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Join communities and connect with like-minded developers
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <MdAdd className="h-4 w-4" />
          Create Community
        </Button>
      </div>

      {/* Search, Filters, and View Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view" className="flex items-center gap-2">
              <MdGridOn className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" className="flex items-center gap-2">
              <MdViewList className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="capitalize data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 hover:bg-gray-200 dark:hover:bg-zinc-700 data-[state=active]:hover:bg-blue-600"
              >
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Communities Display */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CommunityCard
                  community={community}
                  userId={userId}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CommunityListCard
                  community={community}
                  userId={userId}
                />
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CommunityChat;

const CommunityCard = ({
  community,
  userId,
}: {
  community: Community;
  userId: string;
}) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-zinc-200 dark:border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {community.title}
              </CardTitle>
              {community.isTrending && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  <MdTrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {community.isPopular && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  <MdStar className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>{community.noOfPeopleOnline} online</span>
              </div>
              <div className="flex items-center gap-1">
                <MdPeople className="h-4 w-4" />
                <span>{community.totalMembers} members</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <AvatarCircles numPeople={community.totalMembers} avatarUrls={community.avatarUrls} />
          <Badge variant="outline" className="text-xs">
            {community.category}
          </Badge>
        </div>

        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {community.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {community.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{community.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Last activity: {community.lastActivity}
          </span>
          <Link href={`/communityChat/${community.id}`}>
            <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
              Join now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const CommunityListCard = ({
  community,
  userId,
}: {
  community: Community;
  userId: string;
}) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-md border-zinc-200 dark:border-zinc-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <AvatarCircles numPeople={community.totalMembers} avatarUrls={community.avatarUrls} />
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-white truncate">
                    {community.title}
                  </h3>
                  {community.isTrending && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 flex-shrink-0">
                      <MdTrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {community.isPopular && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex-shrink-0">
                      <MdStar className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>{community.noOfPeopleOnline} online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdPeople className="h-4 w-4" />
                    <span>{community.totalMembers} members</span>
                  </div>
                  <span>•</span>
                  <span>Last activity: {community.lastActivity}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {community.category}
                  </Badge>
                  <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {community.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{community.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex-shrink-0 ml-4">
                <Link href={`/communityChat/${community.id}`}>
                  <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
                    Join now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
