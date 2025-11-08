# financeiro/views.py

from rest_framework import viewsets, status
from .models import Cliente, Lancamento
from .serializers import ClienteSerializer, LancamentoSerializer 
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime
from decimal import Decimal # <-- 1. IMPORTAMOS O DECIMAL

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
             return Cliente.objects.all()
        return Cliente.objects.filter(user=user)

class LancamentoViewSet(viewsets.ModelViewSet):
    serializer_class = LancamentoSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = [
        'status', 
        'tipo', 
        'data_vencimento', 
        'conciliado', 
        'cliente'
    ]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Lancamento.objects.all()
        return Lancamento.objects.filter(cliente__user=user)


class DashboardAPIView(APIView):
    """
    View para fornecer dados agregados para o dashboard.
    Aceita query params: ?ano=YYYY&mes=MM (para fluxo de caixa)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        user = request.user

        try:
            ano_req = int(request.query_params.get('ano'))
            mes_req = int(request.query_params.get('mes'))
            data_base = datetime.date(ano_req, mes_req, 1)
            ano = data_base.year
            mes = data_base.month
            
        except (TypeError, ValueError):
            data_base = datetime.date.today()
            ano = data_base.year
            mes = data_base.month

        try:
            if user.is_staff:
                lancamento_qs = Lancamento.objects.all()
                total_clientes = Cliente.objects.count()
            else:
                cliente_usuario = Cliente.objects.get(user=user)
                lancamento_qs = Lancamento.objects.filter(cliente=cliente_usuario)
                total_clientes = 1
        except Cliente.DoesNotExist:
            return Response(
                {"error": "Usuário não associado a nenhum cliente."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        status_pendentes = Q(status='PENDENTE') | Q(status='ATRASADO')
        total_pendente_qs = lancamento_qs.filter(status_pendentes)
        
        balanco_a_receber_total = total_pendente_qs.filter(tipo='RECEBER').aggregate(
            total=Sum('valor')
        )['total'] or Decimal('0.00')

        balanco_a_pagar_total = total_pendente_qs.filter(tipo='PAGAR').aggregate(
            total=Sum('valor')
        )['total'] or Decimal('0.00')
        
        balanco_total_geral = balanco_a_receber_total - balanco_a_pagar_total

        fluxo_total_pago_periodo = lancamento_qs.filter(
            status='PAGO', # Correto (só para Contas a Pagar)
            tipo='PAGAR',
            data_pagamento__year=ano,
            data_pagamento__month=mes
        ).aggregate(total=Sum('valor'))['total'] or Decimal('0.00')
        
        # --- LÓGICA ATUALIZADA AQUI ---
        fluxo_total_recebido_periodo = lancamento_qs.filter(
            status='RECEBIDO', # <-- MUDOU DE 'PAGO' PARA 'RECEBIDO'
            tipo='RECEBER',
            data_pagamento__year=ano,
            data_pagamento__month=mes
        ).aggregate(total=Sum('valor'))['total'] or Decimal('0.00')
        
        fluxo_novos_a_pagar_periodo = lancamento_qs.filter(
            tipo='PAGAR',
            data_vencimento__year=ano,
            data_vencimento__month=mes
        ).aggregate(total=Sum('valor'))['total'] or Decimal('0.00')
        
        fluxo_novos_a_receber_periodo = lancamento_qs.filter(
            tipo='RECEBER',
            data_vencimento__year=ano,
            data_vencimento__month=mes
        ).aggregate(total=Sum('valor'))['total'] or Decimal('0.00')

        fluxo_previsao_saldo_periodo = fluxo_novos_a_receber_periodo - fluxo_novos_a_pagar_periodo

        data = {
            'periodo_referencia': f"{ano}-{mes:02d}",
            'total_clientes_ativos': total_clientes,
            
            'balanco_total': {
                'a_receber': balanco_a_receber_total,
                'a_pagar': balanco_a_pagar_total,
                'saldo_geral_pendente': balanco_total_geral,
            },
            
            'fluxo_caixa_periodo': {
                'total_recebido': fluxo_total_recebido_periodo,
                'total_pago': fluxo_total_pago_periodo,
            },
            
            'previsao_periodo': {
                'novos_a_receber': fluxo_novos_a_receber_periodo,
                'novos_a_pagar': fluxo_novos_a_pagar_periodo,
                'saldo_previsto': fluxo_previsao_saldo_periodo,
            }
        }
        
        return Response(data)