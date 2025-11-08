# bpo_config/urls.py

from django.contrib import admin
from django.urls import path, include

# 1. Importe as views do SimpleJWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # URLs da nossa API (Cliente e Lancamento)
    path('api/', include('financeiro.urls')), 
    
    # 2. Adicione as URLs de Autenticação
    # Esta é a URL de LOGIN (o front-end envia 'username' e 'password' para cá)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Esta URL é para renovar o token (quando o de acesso expirar)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]