import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { ImageContainer } from "../styles/pages/product";
import { SuccessContainer } from "../styles/pages/success";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}

// <meta name="robots" content="noindex" /> TAG QUE PEDE PARA CROWLERS NÃO INDEXAREM A PÁGINA!!
export default function Success({customerName, product}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

    <SuccessContainer>
      <h1>Compra efetuada!</h1>

      <ImageContainer>
        <Image src={product.imageUrl} width={120} height={110} alt="" />
      </ImageContainer>

      <p>
        Uhuul, <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa
      </p>

      <Link href="/">
        Voltar ao catálogo
      </Link>
    </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const  sessionId = String(query.session_id);
  
  if(!query.session_id) {
    return {
      redirect: { //redirecionamento pelo server side props caso condição nao seja validada
        destination: '/',  
        permanent: false
      }
    }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}