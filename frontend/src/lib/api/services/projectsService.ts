import ApiManager from "../api-manager";

export const projectsService = {
  async getProjects() {
    const response = await ApiManager.getInstance().get(`/projects`);
    console.log("Get Projects response:", response.data);
    return response.data;
  },
};
