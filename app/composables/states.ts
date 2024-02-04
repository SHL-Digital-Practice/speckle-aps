import type { Content } from '~/server/api/project/[id]';

export const useModelsCart = () => useState<Content[]>('models-cart', () => []);
