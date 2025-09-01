import ApiManager from "../api-manager";

export const communitiesService = {
  async getCommunities() {
    const response = await ApiManager.getInstance().get(`/communities`);
    console.log("Get communities response:", response.data);
    return response.data;
  },

  async getCommunityById(communityId: string) {
    const response = await ApiManager.getInstance().get(
      `/communities/${communityId}`
    );
    console.log("Get community by ID response:", response.data);
    return response.data;
  },
};
