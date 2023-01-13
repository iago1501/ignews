import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import Image from "next/image";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 👋🏻 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton/>
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          height="500px"
          width="500px"
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  
  const price = await stripe.prices.retrieve("price_1LkcYoA8qnXu8DnumYom2I1X", {
    expand: ["product"],
  });

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.unit_amount / 100);

  const product = {
    priceId: price.id,
    amount: formattedPrice,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
