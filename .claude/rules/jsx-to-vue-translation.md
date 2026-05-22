# JSX → Vue Translation Rules

The `template/` directory contains the design source as a mix of HTML
and JSX files. This document defines exactly how to translate them
into Vue 3 components for `app/`.

## Step 1 — Identify the source type

For each file in `template/`:

1. **Pure HTML** (`.html`): static markup, no JS framework
2. **JSX** (`.jsx`, `.tsx`): React components with imports, props,
   state

Translation strategy differs significantly between the two.

## Translating HTML

Most direct case.

- `<div class="...">` stays as-is in Vue `<template>`
- Inline styles stay as-is
- Dynamic content (if any, like `{{ }}` Handlebars-style): convert to
  Vue's `{{ }}` syntax
- External CSS: extract reusable parts to Tailwind classes; keep the
  rest in `<style scoped>` inside the component

## Translating JSX

### Attribute conversions

| React/JSX | Vue 3 |
|-----------|-------|
| `className="..."` | `class="..."` |
| `htmlFor="..."` | `for="..."` |
| `onClick={fn}` | `@click="fn"` |
| `onChange={fn}` | `@change="fn"` |
| `onInput={fn}` | `@input="fn"` |
| `onSubmit={fn}` | `@submit="fn"` (prefer `@submit.prevent`) |
| `onMouseEnter={fn}` | `@mouseenter="fn"` |
| `value={x}` (controlled) | `:value="x"` or `v-model="x"` |
| `checked={x}` | `:checked="x"` or `v-model="x"` |
| `style={{ color: 'red' }}` | `:style="{ color: 'red' }"` |
| `{expression}` | `{{ expression }}` (in template) |
| `disabled={true}` | `disabled` or `:disabled="true"` |

### Conditional rendering

| React | Vue |
|-------|-----|
| `{condition && <X />}` | `<X v-if="condition" />` |
| `{condition ? <A /> : <B />}` | `<A v-if="condition" />` + `<B v-else />` |

### List rendering

```jsx
// JSX
{items.map(item => <Card key={item.id} item={item} />)}
```

```vue
<!-- Vue -->
<Card v-for="item in items" :key="item.id" :item="item" />
```

### Fragments

| React | Vue |
|-------|-----|
| `<>...</>` | Multiple root nodes (Vue 3 supports this natively) |

If multiple roots cause attribute inheritance issues, wrap in a
single root element.

## Translating React state and lifecycle

### useState

```jsx
const [count, setCount] = useState(0)
setCount(count + 1)
```

```ts
const count = ref(0)
count.value++
```

For object state, prefer `reactive`:

```jsx
const [user, setUser] = useState({ name: '', email: '' })
setUser({ ...user, name: 'Alice' })
```

```ts
const user = reactive({ name: '', email: '' })
user.name = 'Alice'
```

### useEffect

```jsx
useEffect(() => {
  fetchData()
}, [])
```

```ts
onMounted(() => {
  fetchData()
})
```

With dependencies:

```jsx
useEffect(() => {
  doSomething(value)
}, [value])
```

```ts
watch(value, (newValue) => {
  doSomething(newValue)
})
```

With cleanup:

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

```ts
onMounted(() => {
  const id = setInterval(tick, 1000)
  onBeforeUnmount(() => clearInterval(id))
})
```

### useMemo / useCallback

```jsx
const doubled = useMemo(() => count * 2, [count])
```

```ts
const doubled = computed(() => count.value * 2)
```

`useCallback` has no direct Vue equivalent — Vue handles function
identity differently. In most cases, just define a regular function.

### useRef (DOM access)

```jsx
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()
```

```vue
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
onMounted(() => inputRef.value?.focus())
</script>
<template>
  <input ref="inputRef" />
</template>
```

## Component composition

### Props

```jsx
function Card({ title, description, onClick }) {
  return <div onClick={onClick}>{title}: {description}</div>
}
```

```vue
<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
const emit = defineEmits<{ click: [] }>()
</script>
<template>
  <div @click="emit('click')">{{ title }}: {{ description }}</div>
</template>
```

### Children

```jsx
function Wrapper({ children }) {
  return <div className="wrap">{children}</div>
}
```

```vue
<template>
  <div class="wrap">
    <slot />
  </div>
</template>
```

Named slots:

```jsx
function Layout({ header, children }) {
  return <><header>{header}</header><main>{children}</main></>
}
```

```vue
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
</template>
```

## Imports and dependencies

The `template/` files may import from React-specific libraries that
have no equivalent in Vue. Common cases:

| React lib | Vue 3 / Nuxt approach |
|-----------|----------------------|
| `react-router-dom` `<Link>` | `<NuxtLink>` |
| `react-icons` | Nuxt UI's `UIcon` with Iconify collections |
| `framer-motion` | `@vueuse/motion` or CSS transitions |
| `react-hook-form` | `UForm` from Nuxt UI v4 with Zod |
| `tailwind-merge` (`cn` util) | Use Tailwind classes directly; if
| | really needed, port `cn` to a utility |

**Don't install React-to-Vue equivalents unsolicited.** If a JSX
component imports something exotic, flag it to the developer and ask
whether to:
- Find a Vue equivalent
- Reimplement the behavior natively
- Skip that feature for now

## Page-level translation

JSX files representing entire pages → Nuxt pages in `app/pages/`.
File naming follows Nuxt routing conventions:

- `template/HomePage.jsx` → `app/pages/index.vue`
- `template/BlogPage.jsx` → `app/pages/blog/index.vue`
- `template/BlogPost.jsx` → `app/pages/blog/[slug].vue`
- `template/admin/Dashboard.jsx` → `app/pages/admin/index.vue`

## Component reuse decisions

If multiple template files use the same UI block (header, footer,
card, etc.):

1. Extract once to `app/components/` (organized by feature)
2. Reference from every page that needs it
3. **Don't duplicate** — duplication is a violation

If unsure whether a block is reused, ask the developer.

## Fake data placeholder

For pages that will eventually fetch data (blog list, project list,
article detail), the backend doesn't exist yet. So:

1. Declare hardcoded fake data at the top of `<script setup>`
2. Add a `// TODO: replace with useFetch('/api/...') in Phase 3`
   comment
3. **Do not call `useFetch`** until told otherwise — the API isn't
   ready

Example:

```vue
<script setup lang="ts">
// TODO: replace with useFetch('/api/articles') in Phase 3
const articles = [
  {
    id: '1',
    slug: 'first-post',
    title: 'My first post',
    description: 'A short description',
    coverImage: null,
    publishedAt: new Date('2026-01-15'),
  },
  // ... 2-3 more
]
</script>
```

## Visual fidelity

The translation must match the template visually. If the JSX uses a
specific class combination, font size, or spacing — keep it. The
designer (you, the developer) chose those values deliberately.

If you find a discrepancy or a value that doesn't translate cleanly,
flag it rather than silently changing it.