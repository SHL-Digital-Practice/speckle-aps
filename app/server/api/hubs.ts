import { AuthenticationClient, BIM360Client } from 'forge-server-utils';

type Hub = {
  id: string;
  name: string;
  region: string;
};

export default defineEventHandler(async (event) => {
  console.log('Fetching hubs...');

  const { apsClientId, apsClientSecret } = useRuntimeConfig(event);

  const authClient = new AuthenticationClient(apsClientId, apsClientSecret);
  const result = await authClient.authenticate(['data:read']);

  // const dataManagementClient = new DataManagementClient({
  //   token: result.access_token,
  // });

  const bim360Client = new BIM360Client({ token: result.access_token });

  const hubsData = await bim360Client.listHubs();

  const hubs: Hub[] = hubsData.map((hub) => ({
    id: hub.id,
    name: hub.name || 'Unnamed Hub',
    region: hub.region || 'Unknown Region',
  }));

  console.log('hubs', hubs);

  return hubs || [];
});
