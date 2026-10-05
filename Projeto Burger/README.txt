# Oliveiras Burger

Site responsivo de hamburgueria com:
- Cardápio por categorias
- Carrinho com quantidade e remoção
- Adicionais
- Cálculo de subtotal, entrega e total
- Checkout com nome, WhatsApp, endereço e pagamento
- Geração de número de pedido
- Envio do resumo para WhatsApp
- Persistência do carrinho no localStorage

## Como usar

1. Abra `index.html` no navegador.
2. Para receber pedidos no WhatsApp, abra `script.js`.
3. Procure:
   `const whatsapp="5585999999999";`
4. Troque pelo número de WhatsApp da sua hamburgueria no formato internacional, somente números.

O valor da entrega está configurado para R$ 7,00 e fica grátis acima de R$ 80,00. Altere na função `renderCart()` se quiser outra regra.

## Observação

O checkout é funcional no front-end, mas não processa cartão/Pix automaticamente. Para pagamentos reais, conecte um gateway como Mercado Pago, Stripe ou outro serviço de pagamento.
