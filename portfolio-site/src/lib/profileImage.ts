export const profileImage = Object.values(
  import.meta.glob('/src/assets/pfp_placeholder.jpeg', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)[0] as string | undefined
