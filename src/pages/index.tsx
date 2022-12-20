//everything here is rendered on the root path (index is always homepage)

import { styled } from "../styles"

const Button = styled('button', {
  backgroundColor: "$rocketseat",
  borderRadius: 4,  //type number, it will be in px by default
  border: 0,
  padding: "4px 8px",

  span: {  //nested styled tag
    fontWeight: "bold"
  },

  '&:hover': {
    filter: 'brightness(0.8)'
  }
})

export default function Home() {
  return (
    <>
      <Button>
        <span>Enviar</span>
      </Button>
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