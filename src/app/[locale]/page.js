import Image from "next/image";
import styles from "./page.module.css";
import Chapter_0 from "./chapter_0/page";

export default function Home() {
  return (
    <div>
      <main style={{
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center',     
      height: '100vh'           
    }} >
        <Chapter_0>

        </Chapter_0>
      </main>
    </div>
  );
}
