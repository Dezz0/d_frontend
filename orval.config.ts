import { defineConfig } from 'orval';

export default defineConfig({
  main: {
    input: 'http://localhost:8000/openapi.json',
    output: {
      target: 'shared/api/generated',
      schemas: 'shared/api/generated/model',
      // mock: true,
      prettier: true,
      client: 'react-query',
      mode: 'tags-split',
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'offset'
        },
        mutator: {
          path: 'shared/api/baseApiRequest.ts',
          name: 'baseApiRequest'
        }
      }
    }
  }
});
