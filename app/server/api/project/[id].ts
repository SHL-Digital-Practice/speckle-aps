import { AuthenticationClient, BIM360Client } from 'forge-server-utils';

type File = {
  id: string;
  name: string;
  latestVersion?: string;
  type: 'file';
};

type Folder = {
  id: string;
  name: string;
  contents: Content[];
  latestVersion?: string;
  type: 'folder';
};

type Content = File | Folder;

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id');
  const { hubId } = getQuery(event) as { hubId: string };

  if (!projectId) {
    return null;
  }

  console.log('Fetching project content...', projectId, hubId);

  const { apsClientId, apsClientSecret } = useRuntimeConfig(event);

  const authClient = new AuthenticationClient(apsClientId, apsClientSecret);
  const result = await authClient.authenticate(['data:read']);

  const bim360Client = new BIM360Client({ token: result.access_token });

  const projectTopFolders = await bim360Client.listTopFolders(hubId, projectId);

  const folders = projectTopFolders.map<Folder>((f) => ({
    id: f.id,
    name: f.name || 'Unnamed Folder',
    type: 'folder',
    contents: [],
  }));

  const contents = [];
  for (const folder of folders) {
    const folderContent = await getFolderContents(
      folder,
      bim360Client,
      projectId,
    );
    contents.push(...folderContent);
  }

  return contents;
});

async function getFolderContents(
  folder: Folder,
  bim360Client: BIM360Client,
  projectId: string,
): Promise<Content[]> {
  const contents = await bim360Client.listContents(projectId, folder.id);

  const files = contents
    .filter((c) => c.type === 'items')
    .map<File>((f: any) => ({ id: f.id, name: f.displayName, type: 'file' }));

  for (const file of files) {
    const versions = await bim360Client.listVersions(projectId, file.id);
    const latestVersion = versions[0];
    file.latestVersion = latestVersion.derivative;
  }

  const subFolders = contents
    .filter((c) => c.type === 'folders')
    .map<Folder>((f: any) => ({
      id: f.id,
      name: f.name,
      type: 'folder',
      contents: [],
    }));

  folder.contents.push(...files);

  for (const subFolder of subFolders) {
    const subFolderContents = await getFolderContents(
      subFolder,
      bim360Client,
      projectId,
    );
    folder.contents.push(...subFolderContents);
  }

  return folder.contents;
}
