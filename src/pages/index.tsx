//everything here is rendered on the root path (index is always homepage)

import { HomeContainer, Product } from "../styles/pages/home";
import shirtImg from '../assets/shirt.png'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <HomeContainer>
        <Product>
          <Image src={shirtImg} alt="" width={520} height={480} />
          <footer>
            <strong>Camiseta X</strong>
            <span>R$ 79,90</span>
          </footer>
        </Product>

        <Product>
          <Image src={shirtImg} alt="" width={520} height={480} />
          <footer>
            <strong>Camiseta X</strong>
            <span>R$ 79,90</span>
          </footer>
        </Product>

      </HomeContainer>
    </>
  )
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