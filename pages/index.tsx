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
      <main className={styles.main} style={{justifyContent: 'start'}}>
        <div >
          <p style={{fontSize: '1.5rem'}}>
            MICE 2.0 유니티 WEB GL 버전과 Three JS 버전.
          </p>
        </div>

        <div   style={{display: "flex", marginTop:'200px'}} >
          <a
            href="unity/index.html"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin:'50px', fontSize: '1.3rem'}}
          >
            <h2 className={inter.className}>
            MICE 유니티 버전 <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              유니티 버전 mice 샘플 보기
            </p>
          </a>
          
          <a
            href="/threejs"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin:'50px', fontSize: '1.3rem'}}
          >
            <h2 className={inter.className}>
            MICE Three JS 버전 <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
               Three JS 버전 샘플 보기
            </p>
          </a>
 
        </div>
      </main>
    </>
  )
}
