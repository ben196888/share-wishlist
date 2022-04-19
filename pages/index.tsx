import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

type Item = {
  name: string
  status: 'open' | 'reserved' | 'closed'
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const renderItems = (items: Item[]) => {
    return (
      <>
        {
          items.map(item =>
            <a key={item.name} href="#" className={styles.card}>
              <h2>{item.name}</h2>
              <p>Description</p>
            </a>
          )
        }
      </>
    )
  }

  const [newItem, setNewItem] = useState<string>('')
  const onUpdateValue = (event) => {
    setNewItem(event.target.value)
  }
  const onAppendItem = (event) => {
    event.preventDefault();
    setItems(items => [...items, { name: newItem, status: 'open' }])
    setNewItem('')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Share My Wishlist</title>
        <meta name="description" content="Share my wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Wishlist
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <form onSubmit={onAppendItem}>
            <input type="text" onChange={onUpdateValue} value={newItem} />
            <button onClick={onAppendItem}>New</button>
          </form>
          {renderItems(items)}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
