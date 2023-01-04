import { GetStaticProps } from "next/types"
import { stripe } from "../../lib/stripe";
import Image from 'next/image'
import { ProductContainer, ImageContainer, ProductDetails } from "../../styles/pages/product"
import Stripe from "stripe";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
  }
}

export default function Product ({ product }: ProductProps) {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt=""/>
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>
          Comprar agora
        </button>

      </ProductDetails>

    </ProductContainer>
  )
}

export const getStaticProps: GetStaticProps<any, {id:string}> = async ({ params }) => {
  const productId = params?.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: price.unit_amount && new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL' 
        }).format(price.unit_amount / 100), //sempre que for salvar preços salve em centavos pra nao ter problema com float
        description: product.description,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  }
}


/*
  Sempre faça a pergunta:
  
  1) Ao carregar dados via server side (para apresentar mesmo se tiver com o JS desabilitado)
  O dados são atemporais? posso mantê-los em cache se dificilmente mudam?
  Se sim, vai de SSR


  2) Os dados dependem do contexto de execução da pagina? (cookie, usuario logado, alguma info em tempo real) 
  Se nao, vai de SSG

*/