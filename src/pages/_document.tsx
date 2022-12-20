// esse arquivo atua como o html da pasta public em um projeto react normal
import { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from '../styles'; // tratativa para retorno do css a partir do servidor e nao do browser

/*
 quando o usuario carregar a pagina next, ela vai pelo lado do backend, montar a pagina, ver o codigo css necessário pra pagina
 e retornar dessa função getCssText retornando pra tag style 

  O servidor consegue ser mais performatico ao carregar o css, do que o browser.
/ */

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </Head>
      <body>
        <Main/>
        <NextScript /> 
      </body>
    </Html> 

  );
}