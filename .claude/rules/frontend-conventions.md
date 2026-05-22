# Frontend Conventions (Vue 3 + Nuxt 4 + Nuxt UI v4)

## Component Style

- **Always `<script setup lang="ts">`** — never the Options API,
  never untyped scripts.
- **PascalCase filenames** for components: `ArticleCard.vue`,
  `MarkdownRenderer.vue`.
- **Composables prefixed with `use`**: `useArticles.ts`, `useAuth.ts`.

## Component Organization

Group components by feature, not by type:

app/components/
├── ui/                  # Wrappers/extensions of Nuxt UI primitives
├── layout/              # AppHeader, AppFooter, AdminSidebar
├── articles/            # ArticleCard, ArticleList, ArticleMetadata
├── projects/            # ProjectCard, ProjectGallery, TechBadge
├── admin/               # ArticleForm, MarkdownEditor, etc.
└── MarkdownRenderer.vue # Cross-cutting

A component used by only one page can live colocated. A component used
by 2+ pages must go to a feature folder.

## Data Fetching

- **Page-level fetches**: use `useFetch` (Nuxt 4 — note that defaults
  are `undefined`, not `null`).
- **Component-level fetches**: only when truly component-scoped;
  prefer hoisting to page level.
- **Same key across components** = same reactive ref (Nuxt 4
  deduplication). Be aware of cross-component interference.
- **Always handle empty state and error state** explicitly. Never
  ship a page that crashes on empty data.

```vue
<script setup lang="ts">
const { data: articles, error, pending } = await useFetch('/api/articles')
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Failed to load articles</div>
  <div v-else-if="!articles?.data?.length">No articles yet</div>
  <ArticleList v-else :articles="articles.data" />
</template>
```

## Nuxt UI v4 Priority

**Reach for Nuxt UI primitives before building custom components.**
Common components:

- `UButton` for all buttons (variants: solid, outline, soft, ghost,
  link)
- `UForm` + `UFormField` for forms
- `UInput`, `UTextarea`, `USelect`, `USelectMenu`, `UCheckbox`,
  `URadio`
- `UCard` for content cards
- `UTable` for data tables (admin pages)
- `UModal`, `UPopover`, `UTooltip` for overlays
- `UToast` (via `useToast()`) for feedback
- `UAlert` for inline notifications
- `UAvatar`, `UBadge`, `UIcon` for small UI elements

If you find yourself building something Nuxt UI already provides,
stop and use the primitive. If you need to extend, wrap it in
`app/components/ui/`.

## Tailwind v4

- Utility-first — extract to CSS classes only when reused 3+ times
- Custom classes go in `app/assets/css/main.css` under
  `@layer components`
- **Use Nuxt UI v4 design tokens** (colors, spacing) from
  `app.config.ts` rather than hardcoded hex values

## Composables Pattern

A composable wraps a data fetching or stateful concern.

```ts
// app/composables/useArticles.ts
export const useArticles = (options: { page?: Ref<number> } = {}) => {
  const page = options.page ?? ref(1)

  const { data, error, pending, refresh } = useFetch('/api/articles', {
    query: computed(() => ({ page: page.value, limit: 10 })),
  })

  return { articles: data, error, pending, page, refresh }
}
```

## Images

- **Use `<NuxtImg>`** for all content images (not `<img>`)
- The Cloudinary provider is configured in `nuxt.config.ts`
- For static design assets (logos, decorative SVG), regular `<img>`
  or inline SVG is fine

## Links

- **Internal navigation**: `<NuxtLink to="...">` always
- **External links**: regular `<a href="..." target="_blank"
  rel="noopener noreferrer">`

## Page Auth Pattern

For protected admin pages, use the route middleware:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
})
</script>
```

The `auth` middleware in `app/middleware/auth.ts` checks the auth
state via `useAuth()` and redirects to `/admin/login` if needed.

## Forms

- Use `UForm` with Zod schemas defined inline in the script
- Match the Zod schema to the backend Zod schema for the matching
  endpoint
- Use `useToast()` for success/error feedback

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
})

const toast = useToast()

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await $fetch('/api/articles', {
    method: 'POST',
    body: event.data,
  })
  toast.add({ title: 'Article created' })
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Title" name="title">
      <UInput v-model="state.title" />
    </UFormField>
    <UFormField label="Description" name="description">
      <UTextarea v-model="state.description" />
    </UFormField>
    <UButton type="submit">Save</UButton>
  </UForm>
</template>
```

## Type Imports

- Frontend-only types: `app/utils/types.ts` or colocated with usage
- Shared types (used both in `app/` and `server/`): `shared/types/`
- **Never import from `server/` in `app/`** — Nuxt 4 multi-project
  setup prevents this and TS will fail
- **Never duplicate types** — if a type exists in `shared/types/`,
  import it

## Don'ts

- ❌ Don't use `defineComponent` (use `<script setup>`)
- ❌ Don't use the Options API
- ❌ Don't write JSX/TSX components (Vue templates only)
- ❌ Don't add `headlessui`, `shadcn-vue`, `naive-ui`, `vuetify` or
  any UI lib alternative to Nuxt UI v4
- ❌ Don't use `localStorage`/`sessionStorage` directly — use
  `useCookie` or `useState` for cross-component state