export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Minimal wrapper: do not render the global admin navbar here to avoid leaking it into public pages.
  return <main style={{ padding: 16 }}>{children}</main>;
}
