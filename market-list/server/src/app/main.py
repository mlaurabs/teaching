from flask_cors import CORS
from flask_openapi3 import Info, OpenAPI

from src.app.dependencies import (
    get_add_comment_use_case,
    get_add_product_use_case,
    get_delete_product_use_case,
    get_env_config_service,
    get_get_product_use_case,
    get_health_check_use_case,
    get_list_products_use_case,
    get_update_product_use_case,
)

from src.app.routes import (
    register_comment_routes,
    register_docs_routes,
    register_health_routes,
    register_product_routes,
)

from src.infra.logging import configure_logging

config_service = get_env_config_service()

info = Info(
    title=config_service.get_service_name(),
    version=config_service.get_service_version(),
)


def create_app() -> OpenAPI:
    configure_logging()

    app = OpenAPI(__name__, info=info)
    CORS(app)

    register_docs_routes(app)

    register_product_routes(
        app,
        add_use_case=get_add_product_use_case(),
        list_use_case=get_list_products_use_case(),
        get_use_case=get_get_product_use_case(),
        delete_use_case=get_delete_product_use_case(),
        update_use_case=get_update_product_use_case(),
    )

    # Comentários
    register_comment_routes(app, get_add_comment_use_case())

    # Healthcheck
    register_health_routes(app, get_health_check_use_case())

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
