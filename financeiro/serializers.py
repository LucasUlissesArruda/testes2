# financeiro/serializers.py

from rest_framework import serializers
from .models import Cliente, Lancamento 
import datetime

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class LancamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lancamento
        fields = '__all__'

    # --- LÓGICA DE VALIDAÇÃO ATUALIZADA ---
    def validate(self, data):
        """
        Garante que a lógica de pagamento/recebimento esteja correta.
        """
        instance = self.instance
        
        # Define o tipo (novo ou existente)
        tipo = data.get('tipo', instance.tipo if instance else None)
        
        # Define o status (novo ou existente)
        status = data.get('status', instance.status if instance else None)
        
        # Define a data (nova ou existente)
        data_pagamento = data.get('data_pagamento', instance.data_pagamento if instance else None)

        
        # 1. Se o utilizador informar uma DATA DE PAGAMENTO (ao criar ou editar)
        if data.get('data_pagamento'):
            # Define a data de pagamento com o novo valor
            data_pagamento = data.get('data_pagamento')
            
            # Define o status automaticamente com base no TIPO
            if tipo == 'RECEBER':
                data['status'] = 'RECEBIDO'
            elif tipo == 'PAGAR':
                data['status'] = 'PAGO'
            
            # Validação de data futura
            if data_pagamento > datetime.date.today():
                raise serializers.ValidationError("A data de pagamento não pode estar no futuro.")
        
        # 2. Se o utilizador marcar o STATUS como PAGO ou RECEBIDO (e não informou data)
        elif data.get('status') == 'PAGO' or data.get('status') == 'RECEBIDO':
            status = data.get('status') # Pega o novo status
            
            # Verifica se o status é compatível com o tipo
            if status == 'PAGO' and tipo == 'RECEBER':
                raise serializers.ValidationError("Contas a Receber devem ter status 'RECEBIDO', não 'PAGO'.")
            if status == 'RECEBIDO' and tipo == 'PAGAR':
                raise serializers.ValidationError("Contas a Pagar devem ter status 'PAGO', não 'RECEBIDO'.")

            # Se não houver data de pagamento, preenche com hoje
            if not data_pagamento:
                data['data_pagamento'] = datetime.date.today()

        # 3. Se o utilizador marcar como PENDENTE ou ATRASADO
        elif data.get('status') in ('PENDENTE', 'ATRASADO'):
            # Limpa a data de pagamento
            data['data_pagamento'] = None
            
        return data