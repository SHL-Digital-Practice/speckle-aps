import { AuthenticationClient, BIM360Client } from 'forge-server-utils';

type Project = {
  id: string;
  name: string;
};

const projectsCache: Project[] = [];

export default defineEventHandler(async (event) => {
  console.log('Fetching proejcts...');
  const query = getQuery(event);
  const { hubId } = query;

  if (!hubId) {
    return [];
  }

  const { apsClientId, apsClientSecret } = useRuntimeConfig(event);

  const authClient = new AuthenticationClient(apsClientId, apsClientSecret);
  const result = await authClient.authenticate(['data:read']);

  const bim360Client = new BIM360Client({ token: result.access_token });

  if (projectsCache.length === 0) {
    console.log('Fetching projects for hub', hubId);
    const projectsData = await bim360Client.listProjects(hubId as string);
    const projects: Project[] = projectsData.map((project) => ({
      id: project.id,
      name: project.name || 'Unnamed Project',
    }));
    projectsCache.push(...projects);
  } else {
    console.log('Using cached projects');
  }

  return projectsCache || [];
});
