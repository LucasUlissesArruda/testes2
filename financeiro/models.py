# financeiro/models.py

from django.db import models
from django.contrib.auth.models import User

class Cliente(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name="cliente_profile"
    )
    razao_social = models.CharField(max_length=255, verbose_name="Razão Social")
    cnpj = models.CharField(max_length=18, unique=True, verbose_name="CNPJ")
    responsavel_nome = models.CharField(max_length=100, verbose_name="Nome do Responsável")
    responsavel_email = models.EmailField(max_length=100, verbose_name="Email do Responsável")
    responsavel_telefone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone")
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.razao_social

class Lancamento(models.Model):
    TIPO_CHOICES = (
        ('PAGAR', 'Contas a Pagar'),
        ('RECEBER', 'Contas a Receber'),
    )
    
    # --- STATUS_CHOICES ATUALIZADO ---
    STATUS_CHOICES = (
        ('PENDENTE', 'Pendente'),
        ('ATRASADO', 'Atrasado'),
        ('CANCELADO', 'Cancelado'),
        ('PAGO', 'Pago (Contas a Pagar)'),
        ('RECEBIDO', 'Recebido (Contas a Receber)'), # <-- ADICIONADO
    )

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='lancamentos', verbose_name="Cliente")
    
    descricao = models.CharField(max_length=255, verbose_name="Descrição")
    valor = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor")
    data_vencimento = models.DateField(verbose_name="Data de Vencimento")
    data_pagamento = models.DateField(null=True, blank=True, verbose_name="Data de Pagamento")
    
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES, verbose_name="Tipo")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDENTE', verbose_name="Status")
    
    conciliado = models.BooleanField(default=False, verbose_name="Conciliado")
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.descricao} - R$ {self.valor}"