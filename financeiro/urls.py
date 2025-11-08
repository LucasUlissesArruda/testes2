# financeiro/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, LancamentoViewSet
from .views import ClienteViewSet, LancamentoViewSet, DashboardAPIView

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'lancamentos', LancamentoViewSet, basename='lancamento')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]