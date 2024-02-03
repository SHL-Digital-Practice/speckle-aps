export default defineEventHandler(async () => {
  console.log('Creating job...');

  const derivatives = [
    'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLnJoVE5NdUthUTFhblVobUs3M0JLb2c_dmVyc2lvbj00',
  ] as string[];

  for (const derivative of derivatives) {
    const queryParams = new URLSearchParams({ urn: derivative });
    await fetch(
      `https://0844-193-5-54-12.ngrok-free.app/aps/job?${queryParams.toString()}`,
      {
        method: 'POST',
      },
    );
  }

  return 'created';
});
