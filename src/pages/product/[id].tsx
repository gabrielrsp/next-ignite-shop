import { useRouter } from "next/router"
import { ProductContainer, ImageContainer, ProductDetails } from "../../styles/pages/product"
export default function Product () {
  return (
    <ProductContainer>
      <ImageContainer>
      </ImageContainer>

      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,98</span>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, eaque atque quasi nobis doloremque neque eos tempora corrupti sit eligendi explicabo repellendus, reiciendis, tempore ipsa illo excepturi quod accusantium incidunt.</p>

        <button>
          Comprar agora
        </button>

      </ProductDetails>

    </ProductContainer>
  )
}