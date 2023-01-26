import { GetStaticPaths, GetStaticProps } from "next/types"
import { stripe } from "../../lib/stripe";
import Image from 'next/image'
import { ProductContainer, ImageContainer, ProductDetails } from "../../styles/pages/product"
import Stripe from "stripe";
import axios from "axios";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product ({ product }: ProductProps) {
  // const { isFallback } = useRouter()

  // if (isFallback) {
  //   return <p>Loading...</p>
  // }

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  async function handleBuyProduct() {
    try {

      setIsCreatingCheckoutSession(true)
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      }) // nao precisa de baseURL pois front e back rodando na 3000
      
      const { checkoutUrl } = response.data;

      // router.push('/checkout') se fosse pra uma pagina interna
      window.location.href = checkoutUrl  //mas e um redirecionamento pra pagina externa

    } catch (err) {
      setIsCreatingCheckoutSession(false)

      // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)
      alert('Falha ao redirecionar ao checkout!')
    }

  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt=""/>
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
          Comprar agora
        </button>

      </ProductDetails>

    </ProductContainer>
  )
}

// SSG com query params dinamico?
//aqui defino todos os parametros que serão passados no queryParams quando for chamado o getStaticProps
 export const getStaticPaths: GetStaticPaths = async () => {
  /* Abordagens:
    - Ecommerce: adicionar no paths, somente os produtos mais vendidos/acessados
  */


  return {
    paths: [ //aqui é preciso ser o mais enxuto possível pois sera gerado no momento da build
      { params: { id: 'prod_N24REfQlB9BwiL' } },
    ],
    fallback: true //caso id do produto nao esteja no paths, sera executada a função getStaticProps com o id especifico
    // para trazer uma tela em branco enquanto nao tem algo pra mostrar passar fallback: 'blocking' o que nao e recomendado
    // se false, nao carrega nada, ai da 404 
  }
 } 

 export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id

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
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour (lembrando que a função getStaticProps executa nesse intervalo e no momento do build pra gerar a versão estática dessa pagina )
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