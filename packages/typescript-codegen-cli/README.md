# Typescript Codegen

A Graphql-Codegen inspired approach to generate runtime code based on static types.

## Usage

- Initialize: `npx typescript-codegen init`
- Run: `npx typescript-codegen`

## Config

TBD, see initialized config file for now

## Plugins

### typeguards

The goal of this plugin is to write user defined type guards that duck type if an unknown is of a type.

**Input:**

```ts
type AmbigiousString = string | boolean;

interface Post {
  title: string;
  content: string;
  isFeatured: AmbigiousString;
  numberOfComments: number;
}
interface PostResponsePayload {
  timestamp?: string;
  items: Post[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// @ts-gen typeguards
type PostApiResponse = ApiResponse<PostResponsePayload>;
```

**Output:**

```ts
import { PostApiResponse } from "/path/to/src";
export function isPostApiResponse(data: unknown): data is PostApiResponse {
  return (
    typeof data === "object" &&
    typeof data.success === "boolean" &&
    typeof data.data === "object" &&
    (data.data.timestamp === undefined ||
      data.data.timestamp === null ||
      typeof data.data.timestamp === "string") &&
    data.data.items instanceof Array &&
    data.data.items.every(
      item =>
        typeof item.title === "string" &&
        typeof item.content === "string" &&
        (typeof item.isFeatured === "string" ||
          typeof item.isFeatured === "boolean") &&
        typeof item.numberOfComments === "number"
    )
  );
}
```

## Plugin Development Guide

TBD

## Roadmap

- [ ] Init generates a config file
- [ ] Embedded Plugin: duck-typing
- [ ] Embedded Plugin: decoder
- [ ] Documented plugin interface
- [ ] Watch mode
- [ ] Incremental buulds / caching
