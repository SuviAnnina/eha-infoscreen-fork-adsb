import RunwayTemp from "@/components/runwayTemp";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <RunwayTemp />
      <Map />
    </div>
  );
}
