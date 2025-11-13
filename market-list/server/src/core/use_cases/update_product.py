from src.core.exceptions import ProductNotFound


class UpdateProductUseCase:
    def __init__(self, product_repository):
        self.product_repository = product_repository

    def execute(self, nome: str, novo_nome: str = None, quantidade: int = None, valor: float = None):
        """
        Atualiza um produto existente pelo nome.
        Parâmetros opcionais permitem atualizar apenas o que for enviado.
        """
        # Busca produto pelo nome
        produto = self.product_repository.get_by_name(nome)
        if not produto:
            raise ProductNotFound(f"Produto '{nome}' não encontrado.")

        # Atualiza os campos conforme o que veio no payload
        if novo_nome:
            produto.nome = novo_nome
        if quantidade is not None:
            produto.quantidade = quantidade
        if valor is not None:
            produto.valor = valor

        # Persiste as alterações
        self.product_repository.update(nome, produto)


        return produto
