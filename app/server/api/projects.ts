import { AuthenticationClient, BIM360Client } from 'forge-server-utils';

export type Project = {
  id: string;
  name: string;
  hubId: string;
};

const projectsCache: Project[] = [];

export default defineEventHandler(async (event) => {
  console.log('Fetching proejcts...');
  const query = getQuery(event);
  const { hubId, projectSearch } = query;

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
      hubId: hubId as string,
    }));
    projectsCache.push(...projects);
  } else {
    console.log('Using cached projects');
  }

  if (projectSearch) {
    return projectsCache.filter((project) =>
      project.name
        .toLowerCase()
        .includes((projectSearch as string).toLowerCase()),
    );
  }

  return projectsCache || [];
});
