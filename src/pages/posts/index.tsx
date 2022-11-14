import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from './styles.module.scss'
import {RichText} from 'prismic-dom'
import Link from 'next/link'

type Post = {
  slug: string;
  title: string;
  abstract: string;
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
    <Head>
      <title>Posts | Ignews</title>
    </Head>
    <main className={styles.container}>
      <div className={styles.posts}>
        {posts.map(({slug, updatedAt, abstract, title}) => 
        <Link key={slug} href={`/posts/${slug}`} >
          <a>
              <time>{updatedAt}</time>
              <strong>{title}</strong>
              <p>{abstract}</p>
          </a>
        </Link>          
        )}
      </div>
    </main>
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.getAllByType('post', 
  {
    fetchLinks: ['post.title', 'post.content'],
    pageSize: 100,
  }
  )

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      abstract: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {posts}
  }
}
