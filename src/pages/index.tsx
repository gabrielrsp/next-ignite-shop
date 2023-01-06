//everything here is rendered on the root path (index is always homepage)

import { HomeContainer, Product } from "../styles/pages/home";
import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Stripe from "stripe";

// useRef permite ter acesso à referência direta de um elemento na dom

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[]
}

export default function Home({products}: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  // o PREFETCH POR PADRÃO É TRUE, E SÓ COM FUNCIONA COM O APP BUILDADO. 
  // Se for false, o prefetch sera feito somente no hover e nao no carregamento inicial da página
  return (
    <>
      <HomeContainer ref={sliderRef} className="keen-slider" >
        {
          products.map( product => {
            return (
              <Link href={`/product/${product.id}`} key={product.id} >
                <Product 
                  className="keen-slider__slide"
                  >
                  <Image src={product.imageUrl} alt="" width={520} height={480} />
                  <footer>
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </footer>
                </Product>
              </Link>
            )
          })
        }
      </HomeContainer>
    </>
  )
}


/* 
  o getStaticProps trabalha com cache, só é executado quando é feito o build da aplicação
  - Ao gerar o build, o next percorre por todas a paginas identificado a que possuem esse metodo staticProps
  e gera uma versão statica delas
  - Só funciona em produção (rodando npm run build e depois npm run start)

  - podemos definir um prazo pra revalidação do cache com o revalidate

  - ATENÇÃO: ao usar getStaticProps, não temos acesso ao contexto da requisição (req, res, props)
  que são fornecidas no getServerSideProps via desestruturação,
  
  - Até porque páginas estáticas devem ser IGUAIS pra todos os usuários que irão acessá-la

  - Se forem informações dinâmicas, pessoais de um usuario, já é preciso do serverSideProps

  OBS: getServerSideProps : Busca informações do servidor somente no carregamento da página. 
  -> para fazer chamadas de acordo com interações do usuário, é preciso utilizar o api routes
*/
export const getStaticProps: GetStaticProps = async() => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {

    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount && new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL' 
      }).format(price.unit_amount / 100), //sempre que for salvar preços salve em centavos pra nao ter problema com float
    } 
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2, // 2 horas, prazo pra gerar uma nova versão static da pagina.
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