export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        {children}
      </body>
    </html>
  );
}
