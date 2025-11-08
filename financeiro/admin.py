# financeiro/admin.py

from django.contrib import admin
from .models import Cliente, Lancamento

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('razao_social', 'cnpj', 'responsavel_nome', 'responsavel_email')
    search_fields = ('razao_social', 'cnpj')

@admin.register(Lancamento)
class LancamentoAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'cliente', 'valor', 'tipo', 'status', 'data_vencimento')
    search_fields = ('descricao', 'cliente__razao_social')
    list_filter = ('status', 'tipo', 'data_vencimento')