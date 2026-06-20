import Feed from "@/components/Feed";

export default function Home() {
  return (
    <>
    <div className="hidden md:flex lg:flex"> 
      <Feed />
    </div>

    <div className="flex justify-center items-center text-center font-bold text-2xl md:hidden lg:hidden">
        This app isn't available on mobile. Please use a desktop or tablet.
    </div>
    </>
  );
}
