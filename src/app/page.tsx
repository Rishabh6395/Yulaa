import Image from "next/image";
import Nav from "./components/Nav";
import Hero2 from "./components/Hero2";
import Landing from "./components/Landing";
import Parallaxx from "./components/Parallax";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export default function Home() {
  return (
    <div>
      <Parallaxx/>
    </div>
  );
}
