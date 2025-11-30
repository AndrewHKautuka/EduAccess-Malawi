export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="min-h-screen flex-1 p-4">{children}</main>
}
