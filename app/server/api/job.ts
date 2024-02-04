export default defineEventHandler(async (event) => {
  console.log('Creating job...');

  const query = getQuery(event);
  console.log(query);

  const derivative = query.derivatives;

  console.log('Derivative', derivative);

  // for (const derivative of derivatives) {
  const queryParams = new URLSearchParams({ urn: derivative as string });
  const response = await fetch(
    `https://50d1-193-5-54-12.ngrok-free.app/aps/job?${queryParams.toString()}`,
    { method: 'POST' },
  );
  // }

  const { urn: ifcUrn } = await response.json();

  const ifcToSpeckleQueryParams = new URLSearchParams({
    derivativeUrn: ifcUrn,
    projectName: 'Test Project',
    modelUrn: derivative as string,
  });

  const result = await fetch(
    `https://50d1-193-5-54-12.ngrok-free.app/aps/ifc-to-speckle?${ifcToSpeckleQueryParams.toString()}`,
    { method: 'POST' },
  );

  console.log('Result', await result.json());

  // hit the second end point

  return 'created';
});
