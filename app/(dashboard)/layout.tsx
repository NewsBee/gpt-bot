import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";

export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const apiLimitCount = await getApiLimitCount()
  return (
    <div className='h-full relative'>
        <div className="hidden h-full md:flex md:flex-col
        md:fixed md:inset-y-0 bg-gray-900 w-72">
            <Sidebar apiLimitCount={apiLimitCount} />
        </div>
        <main className="md:pl-72 bg-[#E5E7EB] h-full">
            <Navbar/>
            {children}
        </main>
    </div>
  )
}
