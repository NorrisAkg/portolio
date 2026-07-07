import type { Container } from '../shared/container';
import { container } from '../shared/container';

export function useContainer(): Container {
  return container;
}
