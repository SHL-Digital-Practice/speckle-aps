import { AuthenticationClient, BIM360Client } from 'forge-server-utils';

export type Project = {
  id: string;
  name: string;
  hubId: string;
};

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

  console.log('Fetching projects for hub', hubId);
  const projectsData = await bim360Client.listProjects(hubId as string);
  const projects: Project[] = projectsData.map((project) => ({
    id: project.id,
    name: project.name || 'Unnamed Project',
    hubId: hubId as string,
  }));

  if (projectSearch) {
    return projects.filter((project) =>
      project.name
        .toLowerCase()
        .includes((projectSearch as string).toLowerCase()),
    );
  }

  return projects || [];
});
