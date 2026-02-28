"use client"
import Image from "next/image";
import Hero2 from "./Hero2";
import Landing from "./Landing";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export default function Parallaxx() {
  return (
    <div>
      {/* <Parallax pages={4}>
        <ParallaxLayer speed={1} > */}
          <Landing/>
        {/* </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0.3}> */}
          <Hero2/>
        {/* </ParallaxLayer>
      </Parallax> */}

    </div>
  );
}
