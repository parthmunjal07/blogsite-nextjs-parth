import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { auth } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header session={session} />
      {children}
      <Footer />
    </div>
  );
}
