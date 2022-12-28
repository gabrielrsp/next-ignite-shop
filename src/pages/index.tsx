//everything here is rendered on the root path (index is always homepage)

import { HomeContainer, Product } from "../styles/pages/home";
import shirtImg from '../assets/shirt.png'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from "../lib/stripe";
import { GetServerSideProps } from "next";
import Stripe from "stripe";

// useRef permite ter acesso à referência direta de um elemento na dom

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[]
}

export default function Home({products}: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <>
      <HomeContainer ref={sliderRef} className="keen-slider" >
        {
          products.map( product => {
            return (
              <Product key={product.id} className="keen-slider__slide">
              <Image src={product.imageUrl} alt="" width={520} height={480} />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
            )
          })
        }
      </HomeContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async() => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {

    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount && price.unit_amount / 100, //sempre que for salvar preços salve em centavos pra nao ter problema com float
    } 
  })

  return {
    props: {
      products
    }
  } 
}


/* 
A maioria das libs css in js, estilizam o componente em RUN TIME
Ou seja, aplicam somente no lado frontend

Em uma aplicação normal React, toda a aplicação é feita em RUNTIME, 
ou seja, se for desabilitado o javascript do browser, a interface some

Diferente da aplicação next que ja retorna de um servidor node, o html ja montado
para o browser, por isso conseguimos visualizar o html da aplicação mesmo com 
o JS do browser desabilitado.

*/