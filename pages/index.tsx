import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{justifyContent: 'start', padding:'0px'}}>
        <div >
          <p style={{fontSize: '1.5rem'}}>
             MICE 2.0  샘플
            {/* MICE 2.0 유니티 WEB GL 버전과 Three JS 버전. */}
          </p>
        </div>

        <div   style={{display: "flex", marginTop:'200px'}} >

          {/* babylone */}
          <a
            href="unity/index.html"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin:'10px', fontSize: '1.2rem', padding:'5px'}}
          >
            <h2>
             유니티 MICE 샘플  
            </h2>
            <p className={inter.className}>
               모바일에서는 srp pc 에서는 urp 사용 권장됨
               srp 이점: 로딩 속도 향상및 랜더링 속도 향상 있음
               srp 단점: 퀄리티가 떨어짐
            </p>
          </a>

          {/* babylone */}
          <a
            href="/threejs"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin:'10px', fontSize: '1.2rem', padding:'5px'}}
          >
            <h2 className={inter.className}>
            Three JS MICE 샘플   
            </h2>
            <p className={inter.className}>
            단점: 개발양이 가장 많을 수 있음
            </p>
          </a>

          {/* babylone */}
          <a
            href="/babylon"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin:'10px', fontSize: '1.2rem', padding:'5px'}}
          >
            <h2 className={inter.className}>
            Babylon MICE 샘플  
            </h2>
            <p className={inter.className}>
             모바일에서 성능 하락 폭이 상대적으로 크게 나타남
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
