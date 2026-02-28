## Packages
framer-motion | Smooth page transitions and element animations
clsx | Conditional class name joining
tailwind-merge | Merging tailwind classes without conflicts
react-hook-form | Managing complex form state easily
@hookform/resolvers | Integrating Zod validation with react-hook-form

## Notes
- Application uses a global context (`AppContext`) to store saved schemes, matched schemes, and user profile since there is no backend DB for user state in phase 1.
- Custom responsive layout used to ensure a bottom navigation bar on mobile devices and a side navigation on larger screens.
- TanStack Query used for all API communication.
